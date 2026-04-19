package fit.iuh.ticket_service.repositories;

import fit.iuh.ticket_service.entities.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
	long countByOrderId(Long orderId);
	long countByOrderIdAndTicketType_Id(Long orderId, Long ticketTypeId);
}
