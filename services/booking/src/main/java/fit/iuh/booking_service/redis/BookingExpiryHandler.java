package fit.iuh.booking_service.redis;

import fit.iuh.booking_service.entities.Booking;
import fit.iuh.booking_service.entities.BookingStatus;
import fit.iuh.booking_service.repositories.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BookingExpiryHandler {
    private final BookingRepository bookingRepository;

    @Transactional
    public void handleExpiredKey(String expiredKey) {
        if (expiredKey == null || !expiredKey.startsWith(BookingRedisKeys.BOOKING_EXPIRE_KEY_PREFIX)) {
            return;
        }

        String idPart = expiredKey.substring(BookingRedisKeys.BOOKING_EXPIRE_KEY_PREFIX.length());
        Long bookingId;
        try {
            bookingId = Long.parseLong(idPart);
        } catch (NumberFormatException ex) {
            return;
        }

        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking == null) {
            return;
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            return;
        }

        // Only expire if we reached the business time.
        if (booking.getExpiredAt() != null && booking.getExpiredAt().isAfter(LocalDateTime.now())) {
            return;
        }

        booking.setStatus(BookingStatus.EXPIRED);
        booking.setVersion(booking.getVersion() == null ? 1L : booking.getVersion() + 1);
        bookingRepository.save(booking);
    }
}
