package fit.iuh.statistical_service.models;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer_metrics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerMetric {
    @Id
    private Long customerId; // Linked to identity-service userId

    private String customerName;
    private String customerEmail;

    private Integer totalOrders;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal totalSpent;
    
    private LocalDateTime lastPurchaseAt;
    
    private Integer refundCount;
}
