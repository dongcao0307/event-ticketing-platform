package fit.iuh.booking_service.config;

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
    PaymentRabbitProperties.class,
    BookingRabbitProperties.class,
    BookingNotificationRabbitProperties.class,
    BookingLifecycleRabbitProperties.class,
    TicketReservationRabbitProperties.class
})
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
    @ConditionalOnProperty(prefix = "booking.notification.messaging", name = "enabled", havingValue = "true")
    public TopicExchange bookingNotificationExchange(BookingNotificationRabbitProperties properties) {
        return new TopicExchange(properties.getExchange(), true, false);
    }

    @Bean
    @ConditionalOnProperty(prefix = "booking.lifecycle.messaging", name = "enabled", havingValue = "true")
    public TopicExchange bookingLifecycleExchange(BookingLifecycleRabbitProperties properties) {
        return new TopicExchange(properties.getExchange(), true, false);
    }

    @Bean
    @ConditionalOnProperty(prefix = "ticket.reservation.messaging", name = "enabled", havingValue = "true")
    public TopicExchange ticketReservationExchange(TicketReservationRabbitProperties properties) {
        return new TopicExchange(properties.getExchange(), true, false);
    }

    @Bean
    @ConditionalOnProperty(prefix = "ticket.reservation.messaging", name = "enabled", havingValue = "true")
    public Queue ticketReservedQueue(TicketReservationRabbitProperties properties) {
        return new Queue(properties.getReservedQueue(), true);
    }

    @Bean
    @ConditionalOnProperty(prefix = "ticket.reservation.messaging", name = "enabled", havingValue = "true")
    public Queue ticketReservationFailedQueue(TicketReservationRabbitProperties properties) {
        return new Queue(properties.getFailedQueue(), true);
    }

    @Bean
    @ConditionalOnProperty(prefix = "ticket.reservation.messaging", name = "enabled", havingValue = "true")
    public Binding ticketReservedBinding(
            Queue ticketReservedQueue,
            TopicExchange ticketReservationExchange,
            TicketReservationRabbitProperties properties
    ) {
        return BindingBuilder.bind(ticketReservedQueue)
                .to(ticketReservationExchange)
                .with(properties.getReservedRoutingKey());
    }

    @Bean
    @ConditionalOnProperty(prefix = "ticket.reservation.messaging", name = "enabled", havingValue = "true")
    public Binding ticketReservationFailedBinding(
            Queue ticketReservationFailedQueue,
            TopicExchange ticketReservationExchange,
            TicketReservationRabbitProperties properties
    ) {
        return BindingBuilder.bind(ticketReservationFailedQueue)
                .to(ticketReservationExchange)
                .with(properties.getFailedRoutingKey());
    }
}
