package fit.iuh.statistical_service.models;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "ticket_type_stats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketTypeStats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long eventId;
    private String ticketTypeId;
    private String ticketName; // Snapshot of ticket name

    @Column(precision = 15, scale = 2)
    private BigDecimal unitPrice;
    
    private Integer soldCount;
    private Integer refundedCount;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal totalRevenue;
    
    private LocalDate reportDate;
}
