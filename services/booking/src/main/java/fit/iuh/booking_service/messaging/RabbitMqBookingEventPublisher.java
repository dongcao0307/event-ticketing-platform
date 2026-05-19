package fit.iuh.booking_service.messaging;

import fit.iuh.booking_service.config.BookingNotificationRabbitProperties;
import fit.iuh.booking_service.config.BookingRabbitProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "booking.messaging", name = "enabled", havingValue = "true")
public class RabbitMqBookingEventPublisher implements BookingEventPublisher {
    private final RabbitTemplate rabbitTemplate;
    private final BookingRabbitProperties properties;
    private final BookingNotificationRabbitProperties bookingNotificationRabbitProperties;

    @Override
    public void publishBookingPaid(BookingPaidEvent event) {
        rabbitTemplate.convertAndSend(properties.getExchange(), properties.getRoutingKey(), event);
    }

    @Override
    public void publishBookingNotification(BookingNotificationEvent event) {
        rabbitTemplate.convertAndSend(
                bookingNotificationRabbitProperties.getExchange(),
                bookingNotificationRabbitProperties.getRoutingKey(),
                event
        );
    }
}
