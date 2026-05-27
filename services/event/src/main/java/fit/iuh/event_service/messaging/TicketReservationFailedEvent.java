package fit.iuh.event_service.messaging;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TicketReservationFailedEvent {
    private Long bookingId;
    private Long userId;
    private String reason;
    private LocalDateTime failedAt;
}
