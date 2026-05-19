package fit.iuh.notification_service.config;

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
@EnableConfigurationProperties({
        NotificationPaymentRabbitProperties.class,
        NotificationBookingRabbitProperties.class
})
public class RabbitMqConfig {

    @Bean
    public MessageConverter rabbitMessageConverter() {
        return new JacksonJsonMessageConverter();
    }

    @Bean
    @ConditionalOnProperty(prefix = "notification.payment.messaging", name = "enabled", havingValue = "true")
    public TopicExchange paymentNotificationExchange(NotificationPaymentRabbitProperties properties) {
        return new TopicExchange(properties.getExchange(), true, false);
    }

    @Bean
    @ConditionalOnProperty(prefix = "notification.payment.messaging", name = "enabled", havingValue = "true")
    public Queue paymentNotificationQueue(NotificationPaymentRabbitProperties properties) {
        return new Queue(properties.getQueue(), true);
    }

    @Bean
    @ConditionalOnProperty(prefix = "notification.payment.messaging", name = "enabled", havingValue = "true")
    public Binding paymentNotificationBinding(
            Queue paymentNotificationQueue,
            TopicExchange paymentNotificationExchange,
            NotificationPaymentRabbitProperties properties
    ) {
        return BindingBuilder.bind(paymentNotificationQueue)
                .to(paymentNotificationExchange)
                .with(properties.getRoutingKey());
    }

    @Bean
    @ConditionalOnProperty(prefix = "notification.booking.messaging", name = "enabled", havingValue = "true")
    public TopicExchange bookingNotificationExchange(NotificationBookingRabbitProperties properties) {
        return new TopicExchange(properties.getExchange(), true, false);
    }

    @Bean
    @ConditionalOnProperty(prefix = "notification.booking.messaging", name = "enabled", havingValue = "true")
    public Queue bookingNotificationQueue(NotificationBookingRabbitProperties properties) {
        return new Queue(properties.getQueue(), true);
    }

    @Bean
    @ConditionalOnProperty(prefix = "notification.booking.messaging", name = "enabled", havingValue = "true")
    public Binding bookingNotificationBinding(
            Queue bookingNotificationQueue,
            TopicExchange bookingNotificationExchange,
            NotificationBookingRabbitProperties properties
    ) {
        return BindingBuilder.bind(bookingNotificationQueue)
                .to(bookingNotificationExchange)
                .with(properties.getRoutingKey());
    }
}
