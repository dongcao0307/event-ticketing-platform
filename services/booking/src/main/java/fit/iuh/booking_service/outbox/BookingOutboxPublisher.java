package fit.iuh.booking_service.outbox;

import com.fasterxml.jackson.databind.ObjectMapper;
import fit.iuh.booking_service.config.BookingLifecycleRabbitProperties;
import fit.iuh.booking_service.config.BookingNotificationRabbitProperties;
import fit.iuh.booking_service.config.BookingRabbitProperties;
import fit.iuh.booking_service.messaging.BookingCancelledEvent;
import fit.iuh.booking_service.messaging.BookingCreatedEvent;
import fit.iuh.booking_service.messaging.BookingNotificationEvent;
import fit.iuh.booking_service.messaging.BookingPaidEvent;
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
public class BookingOutboxPublisher {
    private final BookingOutboxRepository outboxRepository;
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;
    private final BookingRabbitProperties bookingRabbitProperties;
    private final BookingNotificationRabbitProperties bookingNotificationRabbitProperties;
    private final BookingLifecycleRabbitProperties bookingLifecycleRabbitProperties;

    @Scheduled(fixedDelayString = "${outbox.poll-interval-ms:2000}")
    @Transactional
    public void publishPending() {
        List<BookingOutboxEvent> pending = outboxRepository.findTop50ByStatusOrderByCreatedAtAsc(BookingOutboxStatus.PENDING);
        if (pending.isEmpty()) {
            return;
        }

        for (BookingOutboxEvent event : pending) {
            try {
                publish(event);
                event.setStatus(BookingOutboxStatus.PUBLISHED);
                event.setPublishedAt(LocalDateTime.now());
            } catch (Exception ex) {
                int retries = event.getRetryCount() + 1;
                event.setRetryCount(retries);
                if (retries >= 10) {
                    event.setStatus(BookingOutboxStatus.FAILED);
                    log.error("Outbox event {} failed after retries", event.getId(), ex);
                } else {
                    log.warn("Outbox event {} publish failed (retry {})", event.getId(), retries, ex);
                }
            }
        }
    }

    private void publish(BookingOutboxEvent event) throws Exception {
        switch (event.getEventType()) {
            case BookingOutboxService.EVENT_BOOKING_PAID -> {
                BookingPaidEvent payload = objectMapper.readValue(event.getPayload(), BookingPaidEvent.class);
                rabbitTemplate.convertAndSend(
                        bookingRabbitProperties.getExchange(),
                        bookingRabbitProperties.getRoutingKey(),
                        payload
                );
            }
            case BookingOutboxService.EVENT_BOOKING_NOTIFICATION -> {
                BookingNotificationEvent payload = objectMapper.readValue(event.getPayload(), BookingNotificationEvent.class);
                rabbitTemplate.convertAndSend(
                        bookingNotificationRabbitProperties.getExchange(),
                        bookingNotificationRabbitProperties.getRoutingKey(),
                        payload
                );
            }
            case BookingOutboxService.EVENT_BOOKING_CREATED -> {
                BookingCreatedEvent payload = objectMapper.readValue(event.getPayload(), BookingCreatedEvent.class);
                rabbitTemplate.convertAndSend(
                        bookingLifecycleRabbitProperties.getExchange(),
                        bookingLifecycleRabbitProperties.getCreatedRoutingKey(),
                        payload
                );
            }
            case BookingOutboxService.EVENT_BOOKING_CANCELLED -> {
                BookingCancelledEvent payload = objectMapper.readValue(event.getPayload(), BookingCancelledEvent.class);
                rabbitTemplate.convertAndSend(
                        bookingLifecycleRabbitProperties.getExchange(),
                        bookingLifecycleRabbitProperties.getCancelledRoutingKey(),
                        payload
                );
            }
            default -> throw new IllegalArgumentException("Unknown outbox event type: " + event.getEventType());
        }
    }
}
