package fit.iuh.notification_service.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentNotificationEvent {
    private Long paymentId;
    private Long orderId;
    private BigDecimal amount;
    private LocalDateTime occurredAt;
}
