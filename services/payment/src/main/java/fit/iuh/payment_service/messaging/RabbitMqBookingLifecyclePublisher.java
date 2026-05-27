package fit.iuh.payment_service.messaging;

import fit.iuh.payment_service.config.BookingLifecycleRabbitProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "booking.lifecycle.messaging", name = "enabled", havingValue = "true")
public class RabbitMqBookingLifecyclePublisher implements BookingLifecyclePublisher {
    private final RabbitTemplate rabbitTemplate;
    private final BookingLifecycleRabbitProperties properties;

    @Override
    public void publishBookingCancelled(BookingCancelledEvent event) {
        rabbitTemplate.convertAndSend(properties.getExchange(), properties.getCancelledRoutingKey(), event);
    }
}
