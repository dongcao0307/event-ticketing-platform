package fit.iuh.payment_service.messaging;

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
public class BookingCancelledEvent {
    private Long bookingId;
    private Long userId;
    private String status;
    private String reason;
    private LocalDateTime cancelledAt;
    private List<BookingCancelledItem> items;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BookingCancelledItem {
        private Long ticketTypeId;
        private Integer quantity;
        private BigDecimal unitPrice;
        private String ticketTypeName;
    }
}
