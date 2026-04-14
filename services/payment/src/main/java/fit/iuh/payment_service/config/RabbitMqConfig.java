package fit.iuh.payment_service.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConditionalOnProperty(prefix = "payment.messaging", name = "enabled", havingValue = "true")
public class RabbitMqConfig {

    @Bean
    public TopicExchange paymentExchange(RabbitMqProperties rabbitMqProperties) {
        return new TopicExchange(rabbitMqProperties.getExchange(), true, false);
    }

    @Bean
    public Queue paymentStatusChangedQueue() {
        return new Queue("payment.status.changed.queue", true);
    }

    @Bean
    public Binding paymentStatusChangedBinding(
            Queue paymentStatusChangedQueue,
            TopicExchange paymentExchange,
            RabbitMqProperties rabbitMqProperties
    ) {
        return BindingBuilder.bind(paymentStatusChangedQueue)
                .to(paymentExchange)
                .with(rabbitMqProperties.getRoutingKey());
    }
}
