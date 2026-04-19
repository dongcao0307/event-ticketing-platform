package fit.iuh.event_service.repository;

import fit.iuh.event_service.entity.EventPerformance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventPerformanceRepository extends JpaRepository<EventPerformance, Long> {
    List<EventPerformance> findByEventId(Long eventId);
}
