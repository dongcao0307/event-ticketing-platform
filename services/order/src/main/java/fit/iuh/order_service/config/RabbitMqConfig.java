package fit.iuh.order_service.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({PaymentRabbitProperties.class, OrderRabbitProperties.class})
public class RabbitMqConfig {

    @Bean
    public MessageConverter rabbitMessageConverter() {
        return new JacksonJsonMessageConverter();
    }

    @Bean
    @ConditionalOnProperty(prefix = "payment.messaging", name = "enabled", havingValue = "true")
    public TopicExchange paymentExchange(PaymentRabbitProperties properties) {
        return new TopicExchange(properties.getExchange(), true, false);
    }

    @Bean
    @ConditionalOnProperty(prefix = "payment.messaging", name = "enabled", havingValue = "true")
    public Queue paymentStatusChangedQueue(PaymentRabbitProperties properties) {
        return new Queue(properties.getQueue(), true);
    }

    @Bean
    @ConditionalOnProperty(prefix = "payment.messaging", name = "enabled", havingValue = "true")
    public Binding paymentStatusChangedBinding(
            Queue paymentStatusChangedQueue,
            TopicExchange paymentExchange,
            PaymentRabbitProperties properties
    ) {
        return BindingBuilder.bind(paymentStatusChangedQueue)
                .to(paymentExchange)
                .with(properties.getRoutingKey());
    }

    @Bean
    @ConditionalOnProperty(prefix = "order.messaging", name = "enabled", havingValue = "true")
    public TopicExchange orderExchange(OrderRabbitProperties properties) {
        return new TopicExchange(properties.getExchange(), true, false);
    }

    @Bean
    @ConditionalOnProperty(prefix = "order.messaging", name = "enabled", havingValue = "true")
    public Queue orderPaidQueue(OrderRabbitProperties properties) {
        return new Queue(properties.getQueue(), true);
    }

    @Bean
    @ConditionalOnProperty(prefix = "order.messaging", name = "enabled", havingValue = "true")
    public Binding orderPaidBinding(
            Queue orderPaidQueue,
            TopicExchange orderExchange,
            OrderRabbitProperties properties
    ) {
        return BindingBuilder.bind(orderPaidQueue)
                .to(orderExchange)
                .with(properties.getRoutingKey());
    }
}
