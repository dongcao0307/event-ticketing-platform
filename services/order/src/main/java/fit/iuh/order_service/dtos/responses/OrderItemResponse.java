package fit.iuh.order_service.dtos.responses;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {
    private Long id;
    private Long ticketTypeId;
    private Integer quantity;
    private BigDecimal unitPrice;
}
