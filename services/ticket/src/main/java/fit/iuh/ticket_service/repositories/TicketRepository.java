package fit.iuh.ticket_service.repositories;

import fit.iuh.ticket_service.entities.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
	long countByOrderId(Long orderId);
	long countByOrderIdAndTicketType_Id(Long orderId, Long ticketTypeId);
    List<Ticket> findByOrderId(Long orderId);
}
