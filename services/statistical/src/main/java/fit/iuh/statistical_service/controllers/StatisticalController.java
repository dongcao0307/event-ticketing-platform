package fit.iuh.statistical_service.controllers;

import fit.iuh.statistical_service.models.CustomerMetric;
import fit.iuh.statistical_service.models.DailyEventSales;
import fit.iuh.statistical_service.repositories.CustomerMetricRepository;
import fit.iuh.statistical_service.repositories.DailyEventSalesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/statistics")
@RequiredArgsConstructor
public class StatisticalController {

    private final DailyEventSalesRepository dailySalesRepository;
    private final CustomerMetricRepository customerMetricRepository;

    @GetMapping("/revenue")
    public ResponseEntity<?> getRevenue(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        
        List<Object[]> data = dailySalesRepository.getRevenueByDateRange(start, end);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/events/{eventId}")
    public ResponseEntity<?> getEventStats(
            @PathVariable Long eventId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        
        List<DailyEventSales> stats = dailySalesRepository.findByEventIdAndReportDateBetweenOrderByReportDateAsc(eventId, start, end);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/top-customers")
    public ResponseEntity<List<CustomerMetric>> getTopCustomers() {
        return ResponseEntity.ok(customerMetricRepository.findTop10ByOrderByTotalSpentDesc());
    }
}
