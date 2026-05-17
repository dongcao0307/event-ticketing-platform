package fit.iuh.ticket_service.dtos.responses;

import fit.iuh.ticket_service.entities.TicketStatus;
import fit.iuh.ticket_service.entities.TicketType;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TicketResponse {
    private Long id;
    private TicketType ticketType;
    private Long performanceId;
    private Long userId;
    private Long orderId;
    private String qrCode;
    private BigDecimal priceAtPurchase;
    private TicketStatus ticketStatus;
    private String seatNumber;
    private LocalDateTime checkInAt;
}
