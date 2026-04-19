package fit.iuh.ticket_service.dtos.requests;

import fit.iuh.ticket_service.entities.TicketStatus;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import org.hibernate.validator.constraints.Length;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TicketUpdateRequest {
    @PositiveOrZero(message = "id must be greater than or equal 0")
    private Long id;
    @Length(min = 1, message = "qrCode's length must not be empty")
    private String qrCode;
    private TicketStatus ticketStatus;
    @DateTimeFormat(pattern = "dd/MM/yyyy HH:mm:ss")
    private LocalDateTime checkInAt;
}
