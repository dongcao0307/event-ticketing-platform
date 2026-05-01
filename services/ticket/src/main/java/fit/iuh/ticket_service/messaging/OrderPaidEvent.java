package fit.iuh.ticket_service.messaging;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class OrderPaidEvent {
    private Long orderId;
    private Long userId;
    private LocalDateTime paidAt;
    private List<OrderPaidItem> items;

    @Getter
    @Setter
    public static class OrderPaidItem {
        private Long ticketTypeId;
        private Integer quantity;
        private BigDecimal unitPrice;
    }
}
