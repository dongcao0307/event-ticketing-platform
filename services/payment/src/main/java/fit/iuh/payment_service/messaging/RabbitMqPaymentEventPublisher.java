package fit.iuh.payment_service.messaging;

import fit.iuh.payment_service.config.PaymentNotificationRabbitProperties;
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
    private final PaymentNotificationRabbitProperties paymentNotificationRabbitProperties;

    @Override
    public void publishPaymentStatusChanged(PaymentStatusChangedEvent event) {
        rabbitTemplate.convertAndSend(rabbitMqProperties.getExchange(), rabbitMqProperties.getRoutingKey(), event);
    }

    @Override
    public void publishPaymentNotification(PaymentNotificationEvent event) {
        rabbitTemplate.convertAndSend(
                paymentNotificationRabbitProperties.getExchange(),
                paymentNotificationRabbitProperties.getRoutingKey(),
                event
        );
    }
}
