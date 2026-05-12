package fit.iuh.booking_service.dtos.responses;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingItemWithEventResponse {
    private Long id;
    private Long ticketTypeId;
    private String ticketName;
    private Integer quantity;
    private BigDecimal unitPrice;
}
