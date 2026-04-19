package fit.iuh.payment_service.messaging;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(prefix = "payment.messaging", name = "enabled", havingValue = "false", matchIfMissing = true)
public class NoOpPaymentEventPublisher implements PaymentEventPublisher {
    @Override
    public void publishPaymentStatusChanged(PaymentStatusChangedEvent event) {
        // Stub publisher for now. Messaging flow is prepared but disabled.
    }
}
