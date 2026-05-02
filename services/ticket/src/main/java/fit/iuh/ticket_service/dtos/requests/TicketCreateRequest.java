package fit.iuh.ticket_service.dtos.requests;

import fit.iuh.ticket_service.entities.TicketStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import org.hibernate.validator.constraints.Length;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TicketCreateRequest {
    @PositiveOrZero(message = "ticket type id must be greater than or equal 0")
    private Long ticketTypeId;
    @PositiveOrZero(message = "performance id must be greater than or equal 0")
    private Long performanceId;
    @PositiveOrZero(message = "user id must be greater than or equal 0")
    private Long userId;
    @PositiveOrZero(message = "order id must be greater than or equal 0")
    private Long orderId;
    @NotBlank(message = "qrCode's length must not be empty")
    private String qrCode;
    @PositiveOrZero(message = "ticket type id must be greater than or equal 0")
    private BigDecimal priceAtPurchase;
    @Length(max = 50, message = "seatNumber max length is 50")
    private String seatNumber;
}
