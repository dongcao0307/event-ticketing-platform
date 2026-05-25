package fit.iuh.ticket_service.outbox;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketOutboxRepository extends JpaRepository<TicketOutboxEvent, Long> {
    List<TicketOutboxEvent> findTop50ByStatusOrderByCreatedAtAsc(TicketOutboxStatus status);
}
