package fit.iuh.booking_service.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingNotificationEvent {
    private Long bookingId;
    private Long userId;
    private LocalDateTime occurredAt;
    private List<BookingNotificationItem> items;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BookingNotificationItem {
        private Long ticketTypeId;
        private Integer quantity;
        private String ticketTypeName;
    }
}
