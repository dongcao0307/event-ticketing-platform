package fit.iuh.booking_service.dtos.responses;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingAdminResponse {
    private Long id;
    private String customerName;    // Mới
    private String customerEmail;   // Mới
    private String eventName;       // Mới
    private String eventLocation;   // Mới
    private BigDecimal totalAmount;
    private String status;
    private LocalDateTime createdAt;
    private Integer totalTickets;
}