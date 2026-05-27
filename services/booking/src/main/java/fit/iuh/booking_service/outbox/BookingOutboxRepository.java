package fit.iuh.booking_service.outbox;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingOutboxRepository extends JpaRepository<BookingOutboxEvent, Long> {
    List<BookingOutboxEvent> findTop50ByStatusOrderByCreatedAtAsc(BookingOutboxStatus status);
}
