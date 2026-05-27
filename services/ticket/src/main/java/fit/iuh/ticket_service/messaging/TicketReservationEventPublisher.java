package fit.iuh.ticket_service.messaging;

public interface TicketReservationEventPublisher {
    void publishTicketReserved(TicketReservedEvent event);

    void publishTicketReservationFailed(TicketReservationFailedEvent event);
}
