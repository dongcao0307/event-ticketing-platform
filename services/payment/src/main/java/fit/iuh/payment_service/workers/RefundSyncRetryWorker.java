package fit.iuh.payment_service.workers;

import fit.iuh.payment_service.entities.Payment;
import fit.iuh.payment_service.entities.PaymentStatus;
import fit.iuh.payment_service.entities.RefundRequest;
import fit.iuh.payment_service.entities.RefundStatus;
import fit.iuh.payment_service.messaging.PaymentStatusChangedEvent;
import fit.iuh.payment_service.repositories.PaymentRepository;
import fit.iuh.payment_service.repositories.RefundRequestRepository;
import fit.iuh.payment_service.services.PaymentOutboxService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class RefundSyncRetryWorker {
    private final RefundRequestRepository refundRequestRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentOutboxService paymentOutboxService;

    @Value("${refund.sync.max-retry-count:10}")
    private int maxRetryCount;

    @Value("${refund.sync.cooldown-seconds:30}")
    private int cooldownSeconds;

    @Scheduled(fixedDelayString = "${refund.sync.retry-interval-ms:30000}")
    @Transactional
    public void retryPendingSync() {
        List<RefundRequest> pending = refundRequestRepository.findTop50ByStatusOrderByUpdatedAtAsc(RefundStatus.BOOKING_SYNC_PENDING);
        if (pending.isEmpty()) {
            return;
        }

        LocalDateTime cutoff = LocalDateTime.now().minusSeconds(cooldownSeconds);
        for (RefundRequest refundRequest : pending) {
            if (refundRequest.getUpdatedAt() != null && refundRequest.getUpdatedAt().isAfter(cutoff)) {
                continue;
            }
            if (refundRequest.getRetryCount() >= maxRetryCount) {
                refundRequest.setStatus(RefundStatus.FAILED);
                refundRequest.setLastError("BOOKING_SYNC_RETRY_EXCEEDED");
                refundRequest.setUpdatedAt(LocalDateTime.now());
                refundRequestRepository.save(refundRequest);
                continue;
            }

            Payment payment = paymentRepository.findByOrderId(refundRequest.getOrderId()).orElse(null);
            if (payment == null) {
                refundRequest.setRetryCount(refundRequest.getRetryCount() + 1);
                refundRequest.setLastError("PAYMENT_NOT_FOUND_FOR_RETRY");
                refundRequest.setUpdatedAt(LocalDateTime.now());
                refundRequestRepository.save(refundRequest);
                continue;
            }

            boolean queued = paymentOutboxService.enqueuePaymentStatusChanged(PaymentStatusChangedEvent.builder()
                    .paymentId(payment.getId())
                    .orderId(payment.getOrderId())
                    .eventId(payment.getEventId())
                    .status(PaymentStatus.REFUNDED)
                    .occurredAt(LocalDateTime.now())
                    .build());

            if (!queued) {
                log.debug("Skip enqueue for order {} because pending outbox event exists", refundRequest.getOrderId());
                continue;
            }

            refundRequest.setRetryCount(refundRequest.getRetryCount() + 1);
            refundRequest.setUpdatedAt(LocalDateTime.now());
            refundRequest.setLastError("BOOKING_SYNC_RETRY");
            refundRequestRepository.save(refundRequest);
            log.info("Re-enqueued refund sync for order {} (retry #{})", refundRequest.getOrderId(), refundRequest.getRetryCount());
        }
    }
}
