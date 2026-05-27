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
@ConditionalOnProperty(prefix = "booking.messaging", name = "enabled", havingValue = "true")
public class BookingPaidListener {
    private final TicketQuantityService ticketQuantityService;

    @RabbitListener(queues = "${booking.messaging.queue}")
    public void onBookingPaid(BookingPaidEvent event) {
        try {
            ticketQuantityService.handleBookingPaid(event);
        } catch (Exception ex) {
            log.error("Failed to handle booking paid event", ex);
            throw ex;
        }
    }
}
