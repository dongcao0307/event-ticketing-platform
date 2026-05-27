package fit.iuh.booking_service.outbox;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import fit.iuh.booking_service.messaging.BookingCancelledEvent;
import fit.iuh.booking_service.messaging.BookingCreatedEvent;
import fit.iuh.booking_service.messaging.BookingNotificationEvent;
import fit.iuh.booking_service.messaging.BookingPaidEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BookingOutboxService {
    public static final String EVENT_BOOKING_CREATED = "BOOKING_CREATED";
    public static final String EVENT_BOOKING_CANCELLED = "BOOKING_CANCELLED";
    public static final String EVENT_BOOKING_PAID = "BOOKING_PAID";
    public static final String EVENT_BOOKING_NOTIFICATION = "BOOKING_NOTIFICATION";

    private final BookingOutboxRepository outboxRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public void enqueueBookingCreated(BookingCreatedEvent event) {
        enqueue(event.getBookingId(), EVENT_BOOKING_CREATED, event);
    }

    @Transactional
    public void enqueueBookingCancelled(BookingCancelledEvent event) {
        enqueue(event.getBookingId(), EVENT_BOOKING_CANCELLED, event);
    }

    @Transactional
    public void enqueueBookingPaid(BookingPaidEvent event) {
        enqueue(event.getBookingId(), EVENT_BOOKING_PAID, event);
    }

    @Transactional
    public void enqueueBookingNotification(BookingNotificationEvent event) {
        enqueue(event.getBookingId(), EVENT_BOOKING_NOTIFICATION, event);
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

        BookingOutboxEvent outboxEvent = BookingOutboxEvent.builder()
                .aggregateType("BOOKING")
                .aggregateId(bookingId.toString())
                .eventType(eventType)
                .payload(json)
                .status(BookingOutboxStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .retryCount(0)
                .build();

        outboxRepository.save(outboxEvent);
    }
}
