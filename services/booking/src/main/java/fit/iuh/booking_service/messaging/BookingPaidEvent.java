package fit.iuh.booking_service.messaging;

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
public class BookingPaidEvent {
    private Long bookingId;
    private Long userId;
    private LocalDateTime paidAt;
    private List<BookingPaidItem> items;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BookingPaidItem {
        private Long ticketTypeId;
        private Integer quantity;
        private BigDecimal unitPrice;
    }
}
