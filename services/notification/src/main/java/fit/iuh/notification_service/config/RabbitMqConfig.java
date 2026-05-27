package fit.iuh.notification_service.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.config.RetryInterceptorBuilder;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory;
import org.springframework.amqp.rabbit.retry.RejectAndDontRequeueRecoverer;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties({
        NotificationPaymentRabbitProperties.class,
    NotificationBookingRabbitProperties.class,
    NotificationListenerProperties.class,
    NotificationOrchestratorProperties.class
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
    public TopicExchange paymentNotificationDlqExchange(NotificationPaymentRabbitProperties properties) {
        return new TopicExchange(properties.getDlqExchange(), true, false);
    }

    @Bean
    @ConditionalOnProperty(prefix = "notification.payment.messaging", name = "enabled", havingValue = "true")
    public Queue paymentNotificationQueue(NotificationPaymentRabbitProperties properties) {
        return QueueBuilder.durable(properties.getQueue())
                .withArgument("x-dead-letter-exchange", properties.getDlqExchange())
                .withArgument("x-dead-letter-routing-key", properties.getDlqRoutingKey())
                .build();
    }

    @Bean
    @ConditionalOnProperty(prefix = "notification.payment.messaging", name = "enabled", havingValue = "true")
    public Queue paymentNotificationDlqQueue(NotificationPaymentRabbitProperties properties) {
        return QueueBuilder.durable(properties.getDlqQueue()).build();
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
            @ConditionalOnProperty(prefix = "notification.payment.messaging", name = "enabled", havingValue = "true")
            public Binding paymentNotificationDlqBinding(
                Queue paymentNotificationDlqQueue,
                TopicExchange paymentNotificationDlqExchange,
                NotificationPaymentRabbitProperties properties
            ) {
            return BindingBuilder.bind(paymentNotificationDlqQueue)
                .to(paymentNotificationDlqExchange)
                .with(properties.getDlqRoutingKey());
            }

    @Bean
    @ConditionalOnProperty(prefix = "notification.booking.messaging", name = "enabled", havingValue = "true")
    public TopicExchange bookingNotificationExchange(NotificationBookingRabbitProperties properties) {
        return new TopicExchange(properties.getExchange(), true, false);
    }

    @Bean
    @ConditionalOnProperty(prefix = "notification.booking.messaging", name = "enabled", havingValue = "true")
    public TopicExchange bookingNotificationDlqExchange(NotificationBookingRabbitProperties properties) {
        return new TopicExchange(properties.getDlqExchange(), true, false);
    }

    @Bean
    @ConditionalOnProperty(prefix = "notification.booking.messaging", name = "enabled", havingValue = "true")
    public Queue bookingNotificationQueue(NotificationBookingRabbitProperties properties) {
        return QueueBuilder.durable(properties.getQueue())
                .withArgument("x-dead-letter-exchange", properties.getDlqExchange())
                .withArgument("x-dead-letter-routing-key", properties.getDlqRoutingKey())
                .build();
    }

    @Bean
    @ConditionalOnProperty(prefix = "notification.booking.messaging", name = "enabled", havingValue = "true")
    public Queue bookingNotificationDlqQueue(NotificationBookingRabbitProperties properties) {
        return QueueBuilder.durable(properties.getDlqQueue()).build();
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

            @Bean
            @ConditionalOnProperty(prefix = "notification.booking.messaging", name = "enabled", havingValue = "true")
            public Binding bookingNotificationDlqBinding(
                Queue bookingNotificationDlqQueue,
                TopicExchange bookingNotificationDlqExchange,
                NotificationBookingRabbitProperties properties
            ) {
            return BindingBuilder.bind(bookingNotificationDlqQueue)
                .to(bookingNotificationDlqExchange)
                .with(properties.getDlqRoutingKey());
            }

            @Bean(name = "notificationListenerContainerFactory")
            public SimpleRabbitListenerContainerFactory notificationListenerContainerFactory(
                ConnectionFactory connectionFactory,
                MessageConverter messageConverter,
                NotificationListenerProperties listenerProperties
            ) {
            SimpleRabbitListenerContainerFactory factory = new SimpleRabbitListenerContainerFactory();
            factory.setConnectionFactory(connectionFactory);
            factory.setMessageConverter(messageConverter);
            factory.setDefaultRequeueRejected(false);
            factory.setAdviceChain(RetryInterceptorBuilder.stateless()
                .maxRetries(listenerProperties.getMaxAttempts())
                .backOffOptions(
                    listenerProperties.getInitialInterval().toMillis(),
                    listenerProperties.getMultiplier(),
                    listenerProperties.getMaxInterval().toMillis()
                )
                .recoverer(new RejectAndDontRequeueRecoverer())
                .build());
            return factory;
            }
}
