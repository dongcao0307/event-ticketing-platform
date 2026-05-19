package fit.iuh.statistical_service.repositories;

import fit.iuh.statistical_service.models.TicketTypeStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TicketTypeStatsRepository extends JpaRepository<TicketTypeStats, Long> {
    List<TicketTypeStats> findByEventId(Long eventId);
    List<TicketTypeStats> findByEventIdAndReportDate(Long eventId, java.time.LocalDate reportDate);
}
