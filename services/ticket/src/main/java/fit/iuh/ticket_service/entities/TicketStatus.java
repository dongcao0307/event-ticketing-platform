package fit.iuh.ticket_service.entities;

import lombok.*;

@Getter
@ToString
public enum TicketStatus {
    PENDING,
    PAID,
    USED,
    REFUNDED,
    CANCELLED,
    EXPIRED
}
