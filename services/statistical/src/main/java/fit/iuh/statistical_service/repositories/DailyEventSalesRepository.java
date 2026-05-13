package fit.iuh.statistical_service.repositories;

import fit.iuh.statistical_service.models.DailyEventSales;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyEventSalesRepository extends JpaRepository<DailyEventSales, Long> {
    
    Optional<DailyEventSales> findByEventIdAndReportDate(Long eventId, LocalDate reportDate);
    
    List<DailyEventSales> findByEventIdAndReportDateBetweenOrderByReportDateAsc(Long eventId, LocalDate start, LocalDate end);
    
    @Query("SELECT SUM(e.netRevenue) FROM DailyEventSales e WHERE e.reportDate BETWEEN :start AND :end")
    java.math.BigDecimal getTotalRevenue(LocalDate start, LocalDate end);
    
    @Query("SELECT e.reportDate, SUM(e.netRevenue) FROM DailyEventSales e WHERE e.reportDate BETWEEN :start AND :end GROUP BY e.reportDate ORDER BY e.reportDate")
    List<Object[]> getRevenueByDateRange(LocalDate start, LocalDate end);
}
