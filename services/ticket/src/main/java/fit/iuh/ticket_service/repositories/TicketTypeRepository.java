package fit.iuh.ticket_service.repositories;

import fit.iuh.ticket_service.entities.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketTypeRepository extends JpaRepository<TicketType, Long> {
}
