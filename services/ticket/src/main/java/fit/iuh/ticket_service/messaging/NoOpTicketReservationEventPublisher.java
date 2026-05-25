package fit.iuh.ticket_service.messaging;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(prefix = "ticket.reservation.messaging", name = "enabled", havingValue = "false", matchIfMissing = true)
public class NoOpTicketReservationEventPublisher implements TicketReservationEventPublisher {
    @Override
    public void publishTicketReserved(TicketReservedEvent event) {
        // Intentionally left blank when ticket reservation messaging is disabled.
    }

    @Override
    public void publishTicketReservationFailed(TicketReservationFailedEvent event) {
        // Intentionally left blank when ticket reservation messaging is disabled.
    }
}
