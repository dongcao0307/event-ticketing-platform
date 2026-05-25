package fit.iuh.event_service.messaging;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class TicketReservedEvent {
    private Long bookingId;
    private Long userId;
    private LocalDateTime reservedAt;
    private List<TicketReservedItem> items;

    @Getter
    @Setter
    public static class TicketReservedItem {
        private Long ticketTypeId;
        private Integer quantity;
    }
}
