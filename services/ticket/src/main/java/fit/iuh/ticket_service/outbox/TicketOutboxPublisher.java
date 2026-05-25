package fit.iuh.ticket_service.outbox;

import com.fasterxml.jackson.databind.ObjectMapper;
import fit.iuh.ticket_service.config.TicketReservationRabbitProperties;
import fit.iuh.ticket_service.messaging.TicketReservationFailedEvent;
import fit.iuh.ticket_service.messaging.TicketReservedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "outbox", name = "enabled", havingValue = "true")
public class TicketOutboxPublisher {
    private final TicketOutboxRepository outboxRepository;
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;
    private final TicketReservationRabbitProperties ticketReservationRabbitProperties;

    @Scheduled(fixedDelayString = "${outbox.poll-interval-ms:2000}")
    @Transactional
    public void publishPending() {
        List<TicketOutboxEvent> pending = outboxRepository.findTop50ByStatusOrderByCreatedAtAsc(TicketOutboxStatus.PENDING);
        if (pending.isEmpty()) {
            return;
        }

        for (TicketOutboxEvent event : pending) {
            try {
                publish(event);
                event.setStatus(TicketOutboxStatus.PUBLISHED);
                event.setPublishedAt(LocalDateTime.now());
            } catch (Exception ex) {
                int retries = event.getRetryCount() + 1;
                event.setRetryCount(retries);
                if (retries >= 10) {
                    event.setStatus(TicketOutboxStatus.FAILED);
                    log.error("Outbox event {} failed after retries", event.getId(), ex);
                } else {
                    log.warn("Outbox event {} publish failed (retry {})", event.getId(), retries, ex);
                }
            }
        }
    }

    private void publish(TicketOutboxEvent event) throws Exception {
        switch (event.getEventType()) {
            case TicketOutboxService.EVENT_TICKET_RESERVED -> {
                TicketReservedEvent payload = objectMapper.readValue(event.getPayload(), TicketReservedEvent.class);
                rabbitTemplate.convertAndSend(
                        ticketReservationRabbitProperties.getExchange(),
                        ticketReservationRabbitProperties.getReservedRoutingKey(),
                        payload
                );
            }
            case TicketOutboxService.EVENT_TICKET_RESERVATION_FAILED -> {
                TicketReservationFailedEvent payload = objectMapper.readValue(event.getPayload(), TicketReservationFailedEvent.class);
                rabbitTemplate.convertAndSend(
                        ticketReservationRabbitProperties.getExchange(),
                        ticketReservationRabbitProperties.getFailedRoutingKey(),
                        payload
                );
            }
            default -> throw new IllegalArgumentException("Unknown outbox event type: " + event.getEventType());
        }
    }
}
