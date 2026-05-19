package fit.iuh.ticket_service.messaging;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class BookingPaidEvent {
    private Long bookingId;
    private Long userId;
    private LocalDateTime paidAt;
    private List<BookingPaidItem> items;

    @Getter
    @Setter
    public static class BookingPaidItem {
        private Long ticketTypeId;
        private Integer quantity;
        private BigDecimal unitPrice;
    }
}
