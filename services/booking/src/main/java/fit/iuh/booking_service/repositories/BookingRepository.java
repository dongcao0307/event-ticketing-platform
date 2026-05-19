package fit.iuh.booking_service.repositories;

import fit.iuh.booking_service.dtos.BookingAdminProjection;
import fit.iuh.booking_service.entities.Booking;
import fit.iuh.booking_service.entities.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    Optional<Booking> findByIdempotenceKey(String idempotenceKey);
    List<Booking> findByUserId(Long userId);

    // Trong BookingRepository.java
    @org.springframework.data.jpa.repository.Query(
            value = "SELECT b.id as id, u.full_name as customerName, NULL as customerEmail, " +
                    "e.title as eventName, NULL as eventLocation, b.total_amount as totalAmount, " +
                    "b.status as status, b.created_at as createdAt, " +
                    "COALESCE(SUM(bi.quantity), 0) as totalTickets " +
                    "FROM bookings b " +
                    "LEFT JOIN users u ON b.user_id = u.id " +
                    "LEFT JOIN booking_items bi ON b.id = bi.booking_id " + // Cầu nối 1
                    "LEFT JOIN ticket_types tt ON bi.ticket_type_id = tt.id " + // Cầu nối 2
                    "LEFT JOIN event_performances ep ON tt.performance_id = ep.id " + // Cầu nối 3
                    "LEFT JOIN events e ON ep.event_id = e.id " + // Đã đến được Event!
                    "WHERE (:bookingId IS NULL OR b.id = :bookingId) AND " +
                    "(:userId IS NULL OR b.user_id = :userId) AND " +
                    "(:status IS NULL OR b.status = :status) " +
                    "GROUP BY b.id, u.full_name, e.title, b.total_amount, b.status, b.created_at " +
                    "ORDER BY b.created_at DESC",
            countQuery = "SELECT count(*) FROM bookings b",
            nativeQuery = true
    )
    org.springframework.data.domain.Page<fit.iuh.booking_service.dtos.BookingAdminProjection> searchBookingsByAdmin(
            @org.springframework.data.repository.query.Param("bookingId") Long bookingId,
            @org.springframework.data.repository.query.Param("userId") Long userId,
            @org.springframework.data.repository.query.Param("status") String status,
            org.springframework.data.domain.Pageable pageable
    );
}
