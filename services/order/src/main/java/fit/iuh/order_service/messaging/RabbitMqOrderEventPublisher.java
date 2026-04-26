package fit.iuh.order_service.messaging;

import fit.iuh.order_service.config.OrderRabbitProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "order.messaging", name = "enabled", havingValue = "true")
public class RabbitMqOrderEventPublisher implements OrderEventPublisher {
    private final RabbitTemplate rabbitTemplate;
    private final OrderRabbitProperties properties;

    @Override
    public void publishOrderPaid(OrderPaidEvent event) {
        rabbitTemplate.convertAndSend(properties.getExchange(), properties.getRoutingKey(), event);
    }
}
