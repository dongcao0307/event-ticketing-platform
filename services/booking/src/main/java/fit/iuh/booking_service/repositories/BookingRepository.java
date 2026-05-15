package fit.iuh.booking_service.repositories;

import fit.iuh.booking_service.entities.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByIdempotenceKey(String idempotenceKey);

    @Query("select distinct b from Booking b left join fetch b.items where b.id = :bookingId")
    Optional<Booking> findByIdWithItems(@Param("bookingId") Long bookingId);

    List<Booking> findByUserId(Long userId);
}
