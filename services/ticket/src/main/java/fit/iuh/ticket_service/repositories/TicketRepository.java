package fit.iuh.ticket_service.repositories;

import fit.iuh.ticket_service.entities.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
	long countByOrderId(Long orderId);
	long countByOrderIdAndTicketType_Id(Long orderId, Long ticketTypeId);
    List<Ticket> findByOrderId(Long orderId);

    @Query("SELECT t.seatNumber FROM Ticket t WHERE t.performanceId = :performanceId AND t.ticketStatus IN ('PENDING', 'PAID') AND t.seatNumber IS NOT NULL")
    List<String> findBookedSeatsByPerformanceId(@Param("performanceId") Long performanceId);
}
