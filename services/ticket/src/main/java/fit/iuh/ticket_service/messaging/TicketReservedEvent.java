package fit.iuh.ticket_service.messaging;

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
public class TicketReservedEvent {
    private Long bookingId;
    private Long userId;
    private LocalDateTime reservedAt;
    private List<TicketReservedItem> items;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TicketReservedItem {
        private Long ticketTypeId;
        private Integer quantity;
    }
}
