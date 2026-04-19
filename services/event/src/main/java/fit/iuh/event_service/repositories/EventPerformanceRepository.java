package fit.iuh.event_service.repositories;
import fit.iuh.event_service.models.EventPerformance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventPerformanceRepository extends JpaRepository<EventPerformance, Long> {
    List<EventPerformance> findByEventId(Long eventId);
}