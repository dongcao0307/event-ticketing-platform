package fit.iuh.ticket_service.entities;

import lombok.*;

@Getter
@ToString
public enum TicketStatus {
    ACTIVE,
    USED,
    REFUNDED,
    CANCELLED
}
