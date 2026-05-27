package fit.iuh.payment_service.messaging;

import fit.iuh.payment_service.entities.RefundRequest;
import fit.iuh.payment_service.entities.RefundStatus;
import fit.iuh.payment_service.repositories.RefundRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "booking.lifecycle.messaging", name = "enabled", havingValue = "true")
public class BookingCancelledListener {
    private final RefundRequestRepository refundRequestRepository;

    @RabbitListener(queues = "${booking.lifecycle.messaging.cancelled-queue}")
    @Transactional
    public void onBookingCancelled(BookingCancelledEvent event) {
        if (event == null || event.getBookingId() == null || event.getReason() == null) {
            return;
        }

        String reason = event.getReason().trim().toUpperCase();
        if (!"REFUND_COMPLETED".equals(reason) && !"FREE_ORDER_CANCELLED".equals(reason)) {
            return;
        }

        RefundRequest refundRequest = refundRequestRepository
            .findFirstByOrderIdAndStatusInOrderByCreatedAtDesc(
                event.getBookingId(),
                List.of(RefundStatus.BOOKING_SYNC_PENDING, RefundStatus.PROCESSING)
            )
            .orElse(null);
        if (refundRequest == null) {
            return;
        }

        refundRequest.setStatus(RefundStatus.COMPLETED);
        refundRequest.setUpdatedAt(LocalDateTime.now());
        refundRequest.setLastError(null);
        refundRequestRepository.save(refundRequest);
        log.info("Marked refund request {} completed after booking sync for booking {}", refundRequest.getId(), event.getBookingId());
    }
}
