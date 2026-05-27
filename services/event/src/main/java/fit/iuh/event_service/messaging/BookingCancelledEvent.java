package fit.iuh.event_service.messaging;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class BookingCancelledEvent {
    private Long bookingId;
    private Long userId;
    private String status;
    private String reason;
    private LocalDateTime cancelledAt;
    private List<BookingCancelledItem> items;

    @Getter
    @Setter
    public static class BookingCancelledItem {
        private Long ticketTypeId;
        private Integer quantity;
        private BigDecimal unitPrice;
        private String ticketTypeName;
    }
}
