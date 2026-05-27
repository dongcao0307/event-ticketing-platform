package fit.iuh.payment_service.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import fit.iuh.payment_service.entities.PaymentOutboxEvent;
import fit.iuh.payment_service.entities.PaymentOutboxStatus;
import fit.iuh.payment_service.messaging.PaymentStatusChangedEvent;
import fit.iuh.payment_service.repositories.PaymentOutboxRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentOutboxService {
    private static final String EVENT_PAYMENT_STATUS_CHANGED = "PAYMENT_STATUS_CHANGED";

    private final PaymentOutboxRepository paymentOutboxRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public boolean enqueuePaymentStatusChanged(PaymentStatusChangedEvent event) {
        if (event == null || event.getPaymentId() == null || event.getOrderId() == null || event.getStatus() == null) {
            return false;
        }

        boolean hasPending = paymentOutboxRepository.existsByAggregateTypeAndAggregateIdAndEventTypeAndStatusIn(
                "PAYMENT",
                event.getPaymentId().toString(),
                EVENT_PAYMENT_STATUS_CHANGED,
                List.of(PaymentOutboxStatus.PENDING)
        );
        if (hasPending) {
            return false;
        }

        String payload;
        try {
            payload = objectMapper.writeValueAsString(event);
        } catch (JsonProcessingException ex) {
            throw new IllegalStateException("Failed to serialize payment outbox payload", ex);
        }

        PaymentOutboxEvent outboxEvent = PaymentOutboxEvent.builder()
                .aggregateType("PAYMENT")
                .aggregateId(event.getPaymentId().toString())
                .eventType(EVENT_PAYMENT_STATUS_CHANGED)
                .payload(payload)
                .status(PaymentOutboxStatus.PENDING)
                .retryCount(0)
                .createdAt(LocalDateTime.now())
                .build();

        paymentOutboxRepository.save(outboxEvent);
            return true;
    }
}
