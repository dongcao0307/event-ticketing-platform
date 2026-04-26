package fit.iuh.booking_service.messaging;

import fit.iuh.booking_service.dtos.requests.UpdateBookingStatusRequest;
import fit.iuh.booking_service.entities.BookingStatus;
import fit.iuh.booking_service.services.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "payment.messaging", name = "enabled", havingValue = "true")
public class PaymentStatusChangedListener {
    private final BookingService bookingService;

    @RabbitListener(queues = "${payment.messaging.queue}")
    public void onPaymentStatusChanged(PaymentStatusChangedEvent event) {
        if (event == null || event.getBookingId() == null || event.getStatus() == null) {
            return;
        }

        if (!"COMPLETED".equalsIgnoreCase(event.getStatus())) {
            return;
        }

        try {
            bookingService.updateBookingStatus(
                    event.getBookingId(),
                    UpdateBookingStatusRequest.builder().status(BookingStatus.PAID).build()
            );
            log.info("Booking {} marked as PAID from payment event {}", event.getBookingId(), event.getPaymentId());
        } catch (Exception ex) {
            log.error("Failed to mark booking {} as PAID from payment event", event.getBookingId(), ex);
            throw ex;
        }
    }
}
