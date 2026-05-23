package fit.iuh.booking_service.repositories;

import fit.iuh.booking_service.dtos.BookingAdminProjection;
import fit.iuh.booking_service.entities.Booking;
import fit.iuh.booking_service.entities.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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

    // Trong BookingRepository.java
    @org.springframework.data.jpa.repository.Query(
            value = "SELECT b.id as id, u.full_name as customerName, a.email as customerEmail, u.phone_number as customerPhone, " +
                    "e.title as eventName, e.location as eventLocation, b.total_amount as totalAmount, " +
                    "b.status as status, b.created_at as createdAt, " +
                    "COALESCE(SUM(bi.quantity), 0) as totalTickets " +
                    "FROM bookings b " +
                    "LEFT JOIN users u ON b.user_id = u.id " +
                    "LEFT JOIN accounts a ON u.account_user_name = a.user_name " +
                    "LEFT JOIN booking_items bi ON b.id = bi.booking_id " +
                    "LEFT JOIN ticket_types tt ON bi.ticket_type_id = tt.id " +
                    "LEFT JOIN event_performances ep ON tt.performance_id = ep.id " +
                    "LEFT JOIN events e ON ep.event_id = e.id " +
                    "WHERE (:status IS NULL OR b.status = :status) AND " +
                    "(:keyword IS NULL OR :keyword = '' OR " +
                    "  CAST(b.id AS CHAR) LIKE CONCAT('%', :keyword, '%') OR " +
                    "  LOWER(u.full_name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                    "  LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%'))" +
                    ") " +
                    "GROUP BY b.id, u.full_name, a.email, u.phone_number, e.title, e.location, b.total_amount, b.status, b.created_at " +
                    "ORDER BY b.created_at DESC",
            countQuery = "SELECT count(DISTINCT b.id) FROM bookings b " +
                    "LEFT JOIN users u ON b.user_id = u.id " +
                    "LEFT JOIN booking_items bi ON b.id = bi.booking_id " +
                    "LEFT JOIN ticket_types tt ON bi.ticket_type_id = tt.id " +
                    "LEFT JOIN event_performances ep ON tt.performance_id = ep.id " +
                    "LEFT JOIN events e ON ep.event_id = e.id " +
                    "WHERE (:status IS NULL OR b.status = :status) AND " +
                    "(:keyword IS NULL OR :keyword = '' OR " +
                    "  CAST(b.id AS CHAR) LIKE CONCAT('%', :keyword, '%') OR " +
                    "  LOWER(u.full_name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                    "  LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%')))",
            nativeQuery = true
    )
    org.springframework.data.domain.Page<fit.iuh.booking_service.dtos.BookingAdminProjection> searchBookingsByAdmin(
            @org.springframework.data.repository.query.Param("keyword") String keyword, // Đã đổi tên và kiểu dữ liệu
            @org.springframework.data.repository.query.Param("userId") Long userId,
            @org.springframework.data.repository.query.Param("status") String status,
            org.springframework.data.domain.Pageable pageable
    );
}
