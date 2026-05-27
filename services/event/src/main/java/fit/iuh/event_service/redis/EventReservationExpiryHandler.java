package fit.iuh.event_service.redis;

import fit.iuh.event_service.services.TicketQuantityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventReservationExpiryHandler {
    private final TicketQuantityService ticketQuantityService;

    public void handleExpiredKey(String expiredKey) {
        if (expiredKey == null || !expiredKey.startsWith(EventReservationKeys.RESERVATION_TTL_PREFIX)) {
            return;
        }

        String idPart = expiredKey.substring(EventReservationKeys.RESERVATION_TTL_PREFIX.length());
        Long bookingId;
        try {
            bookingId = Long.parseLong(idPart);
        } catch (NumberFormatException ex) {
            return;
        }

        try {
            ticketQuantityService.handleReservationExpired(bookingId);
        } catch (Exception ex) {
            log.error("Failed to handle reservation expiration for booking {}", bookingId, ex);
        }
    }
}
