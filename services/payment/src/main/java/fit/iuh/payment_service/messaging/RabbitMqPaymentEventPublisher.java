package fit.iuh.payment_service.messaging;

import fit.iuh.payment_service.config.RabbitMqProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "payment.messaging", name = "enabled", havingValue = "true")
public class RabbitMqPaymentEventPublisher implements PaymentEventPublisher {
    private final RabbitTemplate rabbitTemplate;
    private final RabbitMqProperties rabbitMqProperties;

    @Override
    public void publishPaymentStatusChanged(PaymentStatusChangedEvent event) {
        rabbitTemplate.convertAndSend(rabbitMqProperties.getExchange(), rabbitMqProperties.getRoutingKey(), event);
    }
}
