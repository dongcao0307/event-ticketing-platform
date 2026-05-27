package fit.iuh.ticket_service.config;

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
    BookingRabbitProperties.class,
    BookingLifecycleRabbitProperties.class,
    TicketReservationRabbitProperties.class
})
public class RabbitMqConfig {

    @Bean
    public MessageConverter rabbitMessageConverter() {
        return new JacksonJsonMessageConverter();
    }

    @Bean
    @ConditionalOnProperty(prefix = "booking.messaging", name = "enabled", havingValue = "true")
    public TopicExchange bookingExchange(BookingRabbitProperties properties) {
        return new TopicExchange(properties.getExchange(), true, false);
    }

    @Bean
    @ConditionalOnProperty(prefix = "booking.messaging", name = "enabled", havingValue = "true")
    public Queue bookingPaidQueue(BookingRabbitProperties properties) {
        return new Queue(properties.getQueue(), true);
    }

    @Bean
    @ConditionalOnProperty(prefix = "booking.messaging", name = "enabled", havingValue = "true")
    public Binding bookingPaidBinding(
            Queue bookingPaidQueue,
            TopicExchange bookingExchange,
            BookingRabbitProperties properties
    ) {
        return BindingBuilder.bind(bookingPaidQueue)
                .to(bookingExchange)
                .with(properties.getRoutingKey());
    }

    @Bean
    @ConditionalOnProperty(prefix = "booking.lifecycle.messaging", name = "enabled", havingValue = "true")
    public TopicExchange bookingLifecycleExchange(BookingLifecycleRabbitProperties properties) {
        return new TopicExchange(properties.getExchange(), true, false);
    }

    @Bean
    @ConditionalOnProperty(prefix = "booking.lifecycle.messaging", name = "enabled", havingValue = "true")
    public Queue bookingCreatedQueue(BookingLifecycleRabbitProperties properties) {
        return new Queue(properties.getCreatedQueue(), true);
    }

    @Bean
    @ConditionalOnProperty(prefix = "booking.lifecycle.messaging", name = "enabled", havingValue = "true")
    public Queue bookingCancelledQueue(BookingLifecycleRabbitProperties properties) {
        return new Queue(properties.getCancelledQueue(), true);
    }

    @Bean
    @ConditionalOnProperty(prefix = "booking.lifecycle.messaging", name = "enabled", havingValue = "true")
    public Binding bookingCreatedBinding(
            Queue bookingCreatedQueue,
            TopicExchange bookingLifecycleExchange,
            BookingLifecycleRabbitProperties properties
    ) {
        return BindingBuilder.bind(bookingCreatedQueue)
                .to(bookingLifecycleExchange)
                .with(properties.getCreatedRoutingKey());
    }

    @Bean
    @ConditionalOnProperty(prefix = "booking.lifecycle.messaging", name = "enabled", havingValue = "true")
    public Binding bookingCancelledBinding(
            Queue bookingCancelledQueue,
            TopicExchange bookingLifecycleExchange,
            BookingLifecycleRabbitProperties properties
    ) {
        return BindingBuilder.bind(bookingCancelledQueue)
                .to(bookingLifecycleExchange)
                .with(properties.getCancelledRoutingKey());
    }

    @Bean
    @ConditionalOnProperty(prefix = "ticket.reservation.messaging", name = "enabled", havingValue = "true")
    public TopicExchange ticketReservationExchange(TicketReservationRabbitProperties properties) {
        return new TopicExchange(properties.getExchange(), true, false);
    }
}
