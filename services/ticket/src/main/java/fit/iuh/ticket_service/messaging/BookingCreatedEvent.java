package fit.iuh.ticket_service.messaging;

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
public class BookingCreatedEvent {
    private Long bookingId;
    private Long userId;
    private String idempotenceKey;
    private LocalDateTime createdAt;
    private LocalDateTime expiredAt;
    private List<BookingCreatedItem> items;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BookingCreatedItem {
        private Long ticketTypeId;
        private Integer quantity;
        private BigDecimal unitPrice;
    }
}
