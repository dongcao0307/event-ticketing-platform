package fit.iuh.order_service.dtos.responses;

import fit.iuh.order_service.entities.OrderStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private Long id;
    private Long userId;
    private String idempotenceKey;
    private BigDecimal subtotal;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private LocalDateTime expiredAt;
    private LocalDateTime createdAt;
    private Long version;
    private List<OrderItemResponse> items;
}
