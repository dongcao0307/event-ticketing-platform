package fit.iuh.booking_service.repositories;

import fit.iuh.booking_service.entities.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByIdempotenceKey(String idempotenceKey);
}
