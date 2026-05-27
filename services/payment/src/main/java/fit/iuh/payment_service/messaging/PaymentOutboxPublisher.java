package fit.iuh.payment_service.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import fit.iuh.payment_service.config.RabbitMqProperties;
import fit.iuh.payment_service.entities.PaymentOutboxEvent;
import fit.iuh.payment_service.entities.PaymentOutboxStatus;
import fit.iuh.payment_service.repositories.PaymentOutboxRepository;
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
@ConditionalOnProperty(prefix = "payment.outbox", name = "enabled", havingValue = "true")
public class PaymentOutboxPublisher {
    private final PaymentOutboxRepository paymentOutboxRepository;
    private final RabbitTemplate rabbitTemplate;
    private final RabbitMqProperties rabbitMqProperties;
    private final ObjectMapper objectMapper;

    @Scheduled(fixedDelayString = "${payment.outbox.poll-interval-ms:2000}")
    @Transactional
    public void publishPending() {
        List<PaymentOutboxEvent> pending = paymentOutboxRepository.findTop50ByStatusOrderByCreatedAtAsc(PaymentOutboxStatus.PENDING);
        if (pending.isEmpty()) {
            return;
        }

        for (PaymentOutboxEvent event : pending) {
            try {
                publish(event);
                event.setStatus(PaymentOutboxStatus.PUBLISHED);
                event.setPublishedAt(LocalDateTime.now());
                event.setLastError(null);
            } catch (Exception ex) {
                event.setRetryCount(event.getRetryCount() + 1);
                event.setLastError(ex.getMessage());
                if (event.getRetryCount() >= 10) {
                    event.setStatus(PaymentOutboxStatus.FAILED);
                    log.error("Payment outbox event {} failed after retries", event.getId(), ex);
                } else {
                    log.warn("Payment outbox event {} publish failed (retry {})", event.getId(), event.getRetryCount(), ex);
                }
            }
        }
    }

    private void publish(PaymentOutboxEvent event) throws Exception {
        if (!"PAYMENT_STATUS_CHANGED".equals(event.getEventType())) {
            throw new IllegalArgumentException("Unknown payment outbox event type: " + event.getEventType());
        }

        PaymentStatusChangedEvent payload = objectMapper.readValue(event.getPayload(), PaymentStatusChangedEvent.class);
        rabbitTemplate.convertAndSend(rabbitMqProperties.getExchange(), rabbitMqProperties.getRoutingKey(), payload);
    }
}
