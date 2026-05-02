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
@EnableConfigurationProperties(BookingRabbitProperties.class)
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
}
