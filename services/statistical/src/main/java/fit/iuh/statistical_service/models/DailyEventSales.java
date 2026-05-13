package fit.iuh.statistical_service.models;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_event_sales", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"event_id", "report_date"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyEventSales {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_id", nullable = false)
    private Long eventId;

    @Column(name = "event_title") 
    private String eventTitle; // Snapshot title

    @Column(name = "report_date", nullable = false)
    private LocalDate reportDate;

    @Column(precision = 15, scale = 2)
    private BigDecimal grossRevenue; 

    @Column(precision = 15, scale = 2)
    private BigDecimal netRevenue; 

    private Integer ticketsSold;
    private Integer ticketsRefunded;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal discountAmount;
    
    @Builder.Default
    private String currency = "VND";
    
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
