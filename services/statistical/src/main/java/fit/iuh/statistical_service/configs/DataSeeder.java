package fit.iuh.statistical_service.configs;

import fit.iuh.statistical_service.models.CustomerMetric;
import fit.iuh.statistical_service.models.DailyEventSales;
import fit.iuh.statistical_service.repositories.CustomerMetricRepository;
import fit.iuh.statistical_service.repositories.DailyEventSalesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Random;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final DailyEventSalesRepository dailyRepository;
    private final CustomerMetricRepository customerRepository;
    private final Random random = new Random();

    @Override
    public void run(String... args) throws Exception {
        if (dailyRepository.count() > 0) return;

        // Seed 30 days of data for 3 major events
        for (int i = 0; i < 30; i++) {
            LocalDate date = LocalDate.now().minusDays(i);
            
            // Event 1: Super Show
            dailyRepository.save(createMockSale(1L, "Super Junior - Super Show 10", date));
            // Event 2: Ha Anh Tuan
            dailyRepository.save(createMockSale(2L, "Hà Anh Tuấn - Chân Trời Rực Rỡ", date));
            // Event 10: Den Vau
            dailyRepository.save(createMockSale(10L, "Đen Vâu - Show Của Đen", date));
        }

        // Seed some VIP customers
        customerRepository.save(CustomerMetric.builder()
                .customerId(1L).customerName("Nguyễn Văn A").customerEmail("a@gmail.com")
                .totalOrders(15).totalSpent(new BigDecimal("25000000")).refundCount(0).build());
        customerRepository.save(CustomerMetric.builder()
                .customerId(2L).customerName("Trần Thị B").customerEmail("b@gmail.com")
                .totalOrders(8).totalSpent(new BigDecimal("12000000")).refundCount(1).build());
    }

    private DailyEventSales createMockSale(Long eventId, String title, LocalDate date) {
        int sold = random.nextInt(50) + 10;
        BigDecimal revenue = new BigDecimal(sold * (random.nextInt(500000) + 200000));
        return DailyEventSales.builder()
                .eventId(eventId)
                .eventTitle(title)
                .reportDate(date)
                .ticketsSold(sold)
                .ticketsRefunded(random.nextInt(3))
                .grossRevenue(revenue)
                .netRevenue(revenue.multiply(new BigDecimal("0.95")))
                .discountAmount(revenue.multiply(new BigDecimal("0.05")))
                .build();
    }
}
