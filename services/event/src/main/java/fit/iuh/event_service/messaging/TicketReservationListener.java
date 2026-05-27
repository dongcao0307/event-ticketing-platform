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
@ConditionalOnProperty(prefix = "ticket.reservation.messaging", name = "enabled", havingValue = "true")
public class TicketReservationListener {
    private final TicketQuantityService ticketQuantityService;

    @RabbitListener(queues = "${ticket.reservation.messaging.reserved-queue}")
    public void onTicketReserved(TicketReservedEvent event) {
        try {
            ticketQuantityService.handleTicketReserved(event);
        } catch (Exception ex) {
            log.error("Failed to handle ticket reserved event", ex);
            throw ex;
        }
    }

    @RabbitListener(queues = "${ticket.reservation.messaging.failed-queue}")
    public void onTicketReservationFailed(TicketReservationFailedEvent event) {
        try {
            ticketQuantityService.handleTicketReservationFailed(event);
        } catch (Exception ex) {
            log.error("Failed to handle ticket reservation failed event", ex);
            throw ex;
        }
    }
}
