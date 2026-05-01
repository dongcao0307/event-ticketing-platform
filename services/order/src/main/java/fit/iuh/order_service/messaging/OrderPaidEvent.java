package fit.iuh.order_service.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderPaidEvent {
    private Long orderId;
    private Long userId;
    private LocalDateTime paidAt;
    private List<OrderPaidItem> items;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderPaidItem {
        private Long ticketTypeId;
        private Integer quantity;
        private BigDecimal unitPrice;
    }
}
