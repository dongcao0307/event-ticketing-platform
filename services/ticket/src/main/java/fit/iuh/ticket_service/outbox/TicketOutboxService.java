package fit.iuh.ticket_service.outbox;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import fit.iuh.ticket_service.messaging.TicketReservationFailedEvent;
import fit.iuh.ticket_service.messaging.TicketReservedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TicketOutboxService {
    public static final String EVENT_TICKET_RESERVED = "TICKET_RESERVED";
    public static final String EVENT_TICKET_RESERVATION_FAILED = "TICKET_RESERVATION_FAILED";

    private final TicketOutboxRepository outboxRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public void enqueueTicketReserved(TicketReservedEvent event) {
        enqueue(event.getBookingId(), EVENT_TICKET_RESERVED, event);
    }

    @Transactional
    public void enqueueTicketReservationFailed(TicketReservationFailedEvent event) {
        enqueue(event.getBookingId(), EVENT_TICKET_RESERVATION_FAILED, event);
    }

    private void enqueue(Long bookingId, String eventType, Object payload) {
        if (bookingId == null || payload == null) {
            return;
        }

        String json;
        try {
            json = objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException ex) {
            throw new IllegalStateException("Failed to serialize outbox payload", ex);
        }

        TicketOutboxEvent outboxEvent = TicketOutboxEvent.builder()
                .aggregateType("BOOKING")
                .aggregateId(bookingId.toString())
                .eventType(eventType)
                .payload(json)
                .status(TicketOutboxStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .retryCount(0)
                .build();

        outboxRepository.save(outboxEvent);
    }
}
