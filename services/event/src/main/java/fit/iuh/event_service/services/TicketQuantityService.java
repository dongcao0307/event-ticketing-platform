package fit.iuh.event_service.services;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import fit.iuh.event_service.messaging.BookingCancelledEvent;
import fit.iuh.event_service.messaging.BookingPaidEvent;
import fit.iuh.event_service.messaging.TicketReservationFailedEvent;
import fit.iuh.event_service.messaging.TicketReservedEvent;
import fit.iuh.event_service.models.TicketType;
import fit.iuh.event_service.redis.EventReservationKeys;
import fit.iuh.event_service.redis.EventReservationSnapshot;
import fit.iuh.event_service.repositories.TicketTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TicketQuantityService {
    private final TicketTypeRepository ticketTypeRepository;
    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;

    @Value("${event.reservation.ttl.minutes:15}")
    private long reservationTtlMinutes;

    public void handleTicketReserved(TicketReservedEvent event) {
        if (event == null || event.getBookingId() == null || event.getItems() == null || event.getItems().isEmpty()) {
            return;
        }

        String dataKey = EventReservationKeys.dataKey(event.getBookingId());
        if (Boolean.TRUE.equals(stringRedisTemplate.hasKey(dataKey))) {
            log.info("Reservation already processed for booking {}, skip", event.getBookingId());
            return;
        }

        List<EventReservationSnapshot.ReservationItem> items = toSnapshotItems(event.getItems());
        if (items.isEmpty()) {
            return;
        }

        applyReserved(items);
        storeReservationSnapshot(event.getBookingId(), items);
    }

    public void handleTicketReservationFailed(TicketReservationFailedEvent event) {
        if (event == null || event.getBookingId() == null) {
            return;
        }

        releaseReservationByBooking(event.getBookingId());
    }

    public void handleBookingCancelled(BookingCancelledEvent event) {
        if (event == null || event.getBookingId() == null) {
            return;
        }

        if (isAlreadyProcessed(event.getBookingId())) {
            log.info("Booking cancel already processed for booking {}, skip", event.getBookingId());
            return;
        }

        if (isRefundOrFreeCancel(event)) {
            if (event.getItems() != null && !event.getItems().isEmpty()) {
                reverseSold(event.getItems());
            } else {
                releaseReservationByBooking(event.getBookingId());
            }
        } else {
            releaseReservationByBooking(event.getBookingId());
        }

        markProcessed(event.getBookingId());
    }

    public void handleBookingPaid(BookingPaidEvent event) {
        if (event == null || event.getBookingId() == null || event.getItems() == null || event.getItems().isEmpty()) {
            return;
        }

        List<EventReservationSnapshot.ReservationItem> items = new ArrayList<>();
        for (BookingPaidEvent.BookingPaidItem item : event.getItems()) {
            if (item == null || item.getTicketTypeId() == null || item.getQuantity() == null || item.getQuantity() <= 0) {
                continue;
            }
            items.add(EventReservationSnapshot.ReservationItem.builder()
                    .ticketTypeId(item.getTicketTypeId())
                    .quantity(item.getQuantity())
                    .build());
        }

        if (items.isEmpty()) {
            return;
        }

        moveReservedToSold(items);
        deleteReservationKeys(event.getBookingId());
    }

    public void handleReservationExpired(Long bookingId) {
        releaseReservationByBooking(bookingId);
    }

    private void releaseReservationByBooking(Long bookingId) {
        if (bookingId == null) {
            return;
        }

        EventReservationSnapshot snapshot = readReservationSnapshot(bookingId);
        if (snapshot == null || snapshot.getItems() == null || snapshot.getItems().isEmpty()) {
            deleteReservationKeys(bookingId);
            return;
        }

        releaseReserved(snapshot.getItems());
        deleteReservationKeys(bookingId);
    }

    @Transactional
    public void reverseSold(List<BookingCancelledEvent.BookingCancelledItem> items) {
        for (BookingCancelledEvent.BookingCancelledItem item : items) {
            if (item == null || item.getTicketTypeId() == null || item.getQuantity() == null || item.getQuantity() <= 0) {
                continue;
            }
            adjustQuantities(item.getTicketTypeId(), 0, -item.getQuantity(), false);
        }
    }

    @Transactional
    public void applyReserved(List<EventReservationSnapshot.ReservationItem> items) {
        for (EventReservationSnapshot.ReservationItem item : items) {
            if (item == null || item.getTicketTypeId() == null || item.getQuantity() == null || item.getQuantity() <= 0) {
                continue;
            }
            adjustQuantities(item.getTicketTypeId(), item.getQuantity(), 0, true);
        }
    }

    @Transactional
    public void releaseReserved(List<EventReservationSnapshot.ReservationItem> items) {
        for (EventReservationSnapshot.ReservationItem item : items) {
            if (item == null || item.getTicketTypeId() == null || item.getQuantity() == null || item.getQuantity() <= 0) {
                continue;
            }
            adjustQuantities(item.getTicketTypeId(), -item.getQuantity(), 0, false);
        }
    }

    @Transactional
    public void moveReservedToSold(List<EventReservationSnapshot.ReservationItem> items) {
        for (EventReservationSnapshot.ReservationItem item : items) {
            if (item == null || item.getTicketTypeId() == null || item.getQuantity() == null || item.getQuantity() <= 0) {
                continue;
            }
            moveReservedToSold(item.getTicketTypeId(), item.getQuantity());
        }
    }

    private void moveReservedToSold(Long ticketTypeId, int quantity) {
        int attempts = 0;
        while (attempts < 3) {
            attempts++;
            try {
                TicketType ticketType = ticketTypeRepository.findById(ticketTypeId).orElse(null);
                if (ticketType == null) {
                    return;
                }

                int sold = safeValue(ticketType.getSoldQuantity());
                int reserved = safeValue(ticketType.getReservedQuantity());
                int actual = Math.min(reserved, quantity);

                if (actual <= 0) {
                    return;
                }

                ticketType.setReservedQuantity(reserved - actual);
                ticketType.setSoldQuantity(sold + actual);
                ticketTypeRepository.save(ticketType);
                return;
            } catch (OptimisticLockingFailureException ex) {
                if (attempts >= 3) {
                    throw ex;
                }
            }
        }
    }

    private void adjustQuantities(Long ticketTypeId, int reservedDelta, int soldDelta, boolean checkAvailable) {
        int attempts = 0;
        while (attempts < 3) {
            attempts++;
            try {
                TicketType ticketType = ticketTypeRepository.findById(ticketTypeId).orElse(null);
                if (ticketType == null) {
                    return;
                }

                int total = safeValue(ticketType.getTotalQuantity());
                int sold = safeValue(ticketType.getSoldQuantity());
                int reserved = safeValue(ticketType.getReservedQuantity());

                if (checkAvailable && reservedDelta > 0) {
                    int available = total - sold - reserved;
                    if (available < reservedDelta) {
                        log.warn("Not enough availability for ticketType {}: available {}, requested {}", ticketTypeId, available, reservedDelta);
                        return;
                    }
                }

                int nextReserved = reserved + reservedDelta;
                int nextSold = sold + soldDelta;

                if (nextReserved < 0) {
                    nextReserved = 0;
                }
                if (nextSold < 0) {
                    nextSold = 0;
                }

                ticketType.setReservedQuantity(nextReserved);
                ticketType.setSoldQuantity(nextSold);
                ticketTypeRepository.save(ticketType);
                return;
            } catch (OptimisticLockingFailureException ex) {
                if (attempts >= 3) {
                    throw ex;
                }
            }
        }
    }

    private void storeReservationSnapshot(Long bookingId, List<EventReservationSnapshot.ReservationItem> items) {
        if (bookingId == null || items == null || items.isEmpty()) {
            return;
        }

        try {
            EventReservationSnapshot snapshot = EventReservationSnapshot.builder()
                    .bookingId(bookingId)
                    .items(items)
                    .build();

            String json = objectMapper.writeValueAsString(snapshot);
            String dataKey = EventReservationKeys.dataKey(bookingId);
            String ttlKey = EventReservationKeys.ttlKey(bookingId);

            stringRedisTemplate.opsForValue().set(dataKey, json);
            stringRedisTemplate.opsForValue().set(ttlKey, "1", Duration.ofMinutes(reservationTtlMinutes));
        } catch (Exception ex) {
            log.error("Failed to store reservation snapshot for booking {}", bookingId, ex);
        }
    }

    private EventReservationSnapshot readReservationSnapshot(Long bookingId) {
        String dataKey = EventReservationKeys.dataKey(bookingId);
        String json = stringRedisTemplate.opsForValue().get(dataKey);
        if (json == null || json.isBlank()) {
            return null;
        }

        try {
            return objectMapper.readValue(json, new TypeReference<EventReservationSnapshot>() {});
        } catch (Exception ex) {
            log.error("Failed to parse reservation snapshot for booking {}", bookingId, ex);
            return null;
        }
    }

    private void deleteReservationKeys(Long bookingId) {
        if (bookingId == null) {
            return;
        }

        stringRedisTemplate.delete(EventReservationKeys.dataKey(bookingId));
        stringRedisTemplate.delete(EventReservationKeys.ttlKey(bookingId));
    }

    private boolean isAlreadyProcessed(Long bookingId) {
        return Boolean.TRUE.equals(stringRedisTemplate.hasKey(EventReservationKeys.cancelledKey(bookingId)));
    }

    private void markProcessed(Long bookingId) {
        if (bookingId == null) {
            return;
        }
        stringRedisTemplate.opsForValue().set(EventReservationKeys.cancelledKey(bookingId), "1", Duration.ofMinutes(reservationTtlMinutes));
    }

    private boolean isRefundOrFreeCancel(BookingCancelledEvent event) {
        if (event == null || event.getReason() == null) {
            return false;
        }

        String reason = event.getReason().trim().toUpperCase();
        return "REFUND_COMPLETED".equals(reason) || "FREE_ORDER_CANCELLED".equals(reason);
    }

    private List<EventReservationSnapshot.ReservationItem> toSnapshotItems(List<TicketReservedEvent.TicketReservedItem> items) {
        if (items == null || items.isEmpty()) {
            return Collections.emptyList();
        }

        List<EventReservationSnapshot.ReservationItem> result = new ArrayList<>();
        for (TicketReservedEvent.TicketReservedItem item : items) {
            if (item == null || item.getTicketTypeId() == null || item.getQuantity() == null || item.getQuantity() <= 0) {
                continue;
            }
            result.add(EventReservationSnapshot.ReservationItem.builder()
                    .ticketTypeId(item.getTicketTypeId())
                    .quantity(item.getQuantity())
                    .build());
        }
        return result;
    }

    private int safeValue(Integer value) {
        return value == null ? 0 : value;
    }
}
