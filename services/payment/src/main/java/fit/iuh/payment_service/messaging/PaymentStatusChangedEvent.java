package fit.iuh.payment_service.messaging;

import fit.iuh.payment_service.entities.PaymentStatus;
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
public class PaymentStatusChangedEvent {
    private Long paymentId;
    private Long orderId;
    private Long eventId;
    private PaymentStatus status;
    private LocalDateTime occurredAt;
}
