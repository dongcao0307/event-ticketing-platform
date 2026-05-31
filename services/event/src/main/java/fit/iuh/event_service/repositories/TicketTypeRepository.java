package fit.iuh.event_service.repositories;


import fit.iuh.event_service.models.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketTypeRepository extends JpaRepository<TicketType, Long> {
    List<TicketType> findByPerformanceId(Long performanceId);
}