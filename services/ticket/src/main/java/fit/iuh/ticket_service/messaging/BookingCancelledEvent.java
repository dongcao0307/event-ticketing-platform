package fit.iuh.ticket_service.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

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
}
