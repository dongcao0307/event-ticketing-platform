package fit.iuh.notification_service.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import fit.iuh.notification_service.clients.BookingRestClient;
import fit.iuh.notification_service.config.NotificationOrchestratorProperties;
import fit.iuh.notification_service.entities.NotificationTemplate;
import fit.iuh.notification_service.entities.NotificationTemplateType;
import fit.iuh.notification_service.exceptions.AppException;
import fit.iuh.notification_service.exceptions.ErrorCode;
import fit.iuh.notification_service.grpc.IdentityGrpcClient;
import fit.iuh.notification_service.messaging.BookingNotificationEvent;
import fit.iuh.notification_service.messaging.PaymentNotificationEvent;
import fit.iuh.notification_service.redis.NotificationRedisStore;
import fit.iuh.notification_service.services.payload.BookingSnapshot;
import fit.iuh.notification_service.services.payload.IdentityAccount;
import fit.iuh.notification_service.services.payload.PaymentSnapshot;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationOrchestratorService {
    private final NotificationRedisStore redisStore;
    private final NotificationTemplateService templateService;
    private final NotificationEmailService emailService;
    private final IdentityGrpcClient identityGrpcClient;
    private final BookingRestClient bookingRestClient;
    private final TaskScheduler notificationTaskScheduler;
    private final NotificationOrchestratorProperties orchestratorProperties;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void handlePaymentNotification(PaymentNotificationEvent event) {
        if (event == null || event.getOrderId() == null) {
            return;
        }
        Long orderId = event.getOrderId();
        if (redisStore.isSent(orderId)) {
            return;
        }

        PaymentSnapshot paymentSnapshot = PaymentSnapshot.builder()
                .paymentId(event.getPaymentId())
                .orderId(orderId)
                .amount(event.getAmount())
                .occurredAt(nv(event.getOccurredAt(), LocalDateTime.now()))
                .build();

        redisStore.storePaymentSnapshot(paymentSnapshot, orchestratorProperties.getMergeTtl());

        Optional<BookingSnapshot> bookingSnapshot = redisStore.getBookingSnapshot(orderId);
        if (bookingSnapshot.isPresent()) {
            sendWithBooking(paymentSnapshot, bookingSnapshot.get());
            return;
        }

        if (redisStore.markScheduled(orderId, orchestratorProperties.getScheduleTtl())) {
            schedulePaymentOnlyFallback(paymentSnapshot);
        }
    }

    public void handleBookingNotification(BookingNotificationEvent event) {
        if (event == null || event.getBookingId() == null) {
            return;
        }
        Long bookingId = event.getBookingId();
        if (redisStore.isSent(bookingId)) {
            return;
        }

        BookingSnapshot snapshot = BookingSnapshot.builder()
                .bookingId(event.getBookingId())
                .userId(event.getUserId())
                .occurredAt(nv(event.getOccurredAt(), LocalDateTime.now()))
                .items(mapItems(event.getItems()))
                .build();

        redisStore.storeBookingSnapshot(snapshot, orchestratorProperties.getMergeTtl());

        Optional<PaymentSnapshot> paymentSnapshot = redisStore.getPaymentSnapshot(bookingId);
        if (paymentSnapshot.isPresent()) {
            sendWithBooking(paymentSnapshot.get(), snapshot);
        }
    }

    private void schedulePaymentOnlyFallback(PaymentSnapshot paymentSnapshot) {
        notificationTaskScheduler.schedule(
                () -> attemptPaymentOnlySend(paymentSnapshot.getOrderId()),
                Instant.now().plus(orchestratorProperties.getMergeTtl())
        );
    }

    private void attemptPaymentOnlySend(Long orderId) {
        if (orderId == null || redisStore.isSent(orderId)) {
            return;
        }

        Optional<BookingSnapshot> bookingSnapshot = redisStore.getBookingSnapshot(orderId);
        Optional<PaymentSnapshot> paymentSnapshot = redisStore.getPaymentSnapshot(orderId);
        if (paymentSnapshot.isEmpty()) {
            return;
        }

        if (bookingSnapshot.isPresent()) {
            sendWithBooking(paymentSnapshot.get(), bookingSnapshot.get());
            return;
        }

        sendPaymentOnly(paymentSnapshot.get());
    }

    private void sendWithBooking(PaymentSnapshot paymentSnapshot, BookingSnapshot bookingSnapshot) {
        if (paymentSnapshot == null || bookingSnapshot == null) {
            return;
        }

        Optional<IdentityAccount> account = identityGrpcClient.getAccountByUserId(bookingSnapshot.getUserId());
        if (account.isEmpty()) {
            throw new AppException(ErrorCode.RECIPIENT_NOT_FOUND,
                    "Missing identity account for booking " + bookingSnapshot.getBookingId());
        }

        NotificationTemplate template = templateService.findByType(NotificationTemplateType.PAYMENT_WITH_BOOKING);
        Map<String, Object> data = new HashMap<>();
        data.put("paymentId", String.valueOf(paymentSnapshot.getPaymentId()));
        data.put("orderId", String.valueOf(paymentSnapshot.getOrderId()));
        data.put("amount", formatAmount(paymentSnapshot.getAmount()));
        data.put("bookingId", String.valueOf(bookingSnapshot.getBookingId()));
        data.put("userId", String.valueOf(bookingSnapshot.getUserId()));
        data.put("items", toJson(bookingSnapshot.getItems()));

        emailService.sendWithRetry(account.get().getEmail(), template, data);
        finalizeSent(paymentSnapshot.getOrderId());
    }

    private void sendPaymentOnly(PaymentSnapshot paymentSnapshot) {
        Optional<Long> userId = bookingRestClient.findUserIdByBookingId(paymentSnapshot.getOrderId());
        if (userId.isEmpty()) {
            throw new AppException(ErrorCode.RECIPIENT_NOT_FOUND,
                    "Unable to resolve userId for order " + paymentSnapshot.getOrderId());
        }

        Optional<IdentityAccount> account = identityGrpcClient.getAccountByUserId(userId.get());
        if (account.isEmpty()) {
            throw new AppException(ErrorCode.RECIPIENT_NOT_FOUND,
                    "Missing identity account for order " + paymentSnapshot.getOrderId());
        }

        NotificationTemplate template = templateService.findByType(NotificationTemplateType.PAYMENT_ONLY);
        Map<String, Object> data = new HashMap<>();
        data.put("paymentId", String.valueOf(paymentSnapshot.getPaymentId()));
        data.put("orderId", String.valueOf(paymentSnapshot.getOrderId()));
        data.put("amount", formatAmount(paymentSnapshot.getAmount()));

        emailService.sendWithRetry(account.get().getEmail(), template, data);
        finalizeSent(paymentSnapshot.getOrderId());
    }

    private void finalizeSent(Long orderId) {
        redisStore.markSent(orderId, orchestratorProperties.getSentTtl());
        redisStore.deletePaymentSnapshot(orderId);
        redisStore.deleteBookingSnapshot(orderId);
    }

    private List<BookingSnapshot.BookingSnapshotItem> mapItems(List<BookingNotificationEvent.BookingNotificationItem> items) {
        if (items == null) {
            return List.of();
        }
        return items.stream()
                .map(item -> BookingSnapshot.BookingSnapshotItem.builder()
                        .ticketTypeId(item.getTicketTypeId())
                        .quantity(item.getQuantity())
                        .ticketTypeName(item.getTicketTypeName())
                        .build())
                .toList();
    }

    private String toJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException ex) {
            return String.valueOf(value);
        }
    }

    private String formatAmount(BigDecimal amount) {
        return amount == null ? "0" : amount.toPlainString();
    }

    private LocalDateTime nv(LocalDateTime value, LocalDateTime fallback) {
        return value == null ? fallback : value;
    }
}
