package fit.iuh.event_service.messaging;

import fit.iuh.event_service.services.TicketQuantityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "booking.lifecycle.messaging", name = "enabled", havingValue = "true")
public class BookingCancelledListener {
    private final TicketQuantityService ticketQuantityService;

    @RabbitListener(queues = "${booking.lifecycle.messaging.cancelled-queue}")
    public void onBookingCancelled(BookingCancelledEvent event) {
        try {
            ticketQuantityService.handleBookingCancelled(event);
        } catch (Exception ex) {
            log.error("Failed to handle booking cancelled event", ex);
            throw ex;
        }
    }
}
