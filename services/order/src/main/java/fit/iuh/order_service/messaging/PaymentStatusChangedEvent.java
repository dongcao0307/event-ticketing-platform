package fit.iuh.order_service.messaging;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PaymentStatusChangedEvent {
    private Long paymentId;
    private Long orderId;
    private Long eventId;
    private String status;
    private LocalDateTime occurredAt;
}
