package fit.iuh.ticket_service.messaging;

import fit.iuh.ticket_service.config.TicketReservationRabbitProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "ticket.reservation.messaging", name = "enabled", havingValue = "true")
public class RabbitMqTicketReservationEventPublisher implements TicketReservationEventPublisher {
    private final RabbitTemplate rabbitTemplate;
    private final TicketReservationRabbitProperties properties;

    @Override
    public void publishTicketReserved(TicketReservedEvent event) {
        rabbitTemplate.convertAndSend(properties.getExchange(), properties.getReservedRoutingKey(), event);
    }

    @Override
    public void publishTicketReservationFailed(TicketReservationFailedEvent event) {
        rabbitTemplate.convertAndSend(properties.getExchange(), properties.getFailedRoutingKey(), event);
    }
}
