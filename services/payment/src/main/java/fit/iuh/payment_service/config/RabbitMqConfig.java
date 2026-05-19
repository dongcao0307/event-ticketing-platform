package fit.iuh.payment_service.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({RabbitMqProperties.class, PaymentNotificationRabbitProperties.class})
public class RabbitMqConfig {

    @Bean
    public MessageConverter rabbitMessageConverter() {
        return new JacksonJsonMessageConverter();
    }

    @Bean
    @ConditionalOnProperty(prefix = "payment.messaging", name = "enabled", havingValue = "true")
    public TopicExchange paymentExchange(RabbitMqProperties rabbitMqProperties) {
        return new TopicExchange(rabbitMqProperties.getExchange(), true, false);
    }

    @Bean
    @ConditionalOnProperty(prefix = "payment.messaging", name = "enabled", havingValue = "true")
    public Queue paymentStatusChangedQueue() {
        return new Queue("payment.status.changed.queue", true);
    }

    @Bean
    @ConditionalOnProperty(prefix = "payment.messaging", name = "enabled", havingValue = "true")
    public Binding paymentStatusChangedBinding(
            Queue paymentStatusChangedQueue,
            TopicExchange paymentExchange,
            RabbitMqProperties rabbitMqProperties
    ) {
        return BindingBuilder.bind(paymentStatusChangedQueue)
                .to(paymentExchange)
                .with(rabbitMqProperties.getRoutingKey());
    }

    @Bean
    @ConditionalOnProperty(prefix = "payment.notification.messaging", name = "enabled", havingValue = "true")
    public TopicExchange paymentNotificationExchange(PaymentNotificationRabbitProperties properties) {
        return new TopicExchange(properties.getExchange(), true, false);
    }
}
