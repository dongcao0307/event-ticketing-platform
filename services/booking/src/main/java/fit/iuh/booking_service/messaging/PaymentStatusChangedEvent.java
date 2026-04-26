package fit.iuh.booking_service.messaging;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PaymentStatusChangedEvent {
    private Long paymentId;
    @com.fasterxml.jackson.annotation.JsonAlias("orderId")
    private Long bookingId;
    private Long eventId;
    private String status;
    private LocalDateTime occurredAt;
}
