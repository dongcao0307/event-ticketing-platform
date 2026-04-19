package fit.iuh.order_service.messaging;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(prefix = "order.messaging", name = "enabled", havingValue = "false", matchIfMissing = true)
public class NoOpOrderEventPublisher implements OrderEventPublisher {
    @Override
    public void publishOrderPaid(OrderPaidEvent event) {
        // Intentionally left blank when order messaging is disabled.
    }
}
