package fit.iuh.ticket_service.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Entity
@Table(name = "ticket_types", check = {
        @CheckConstraint(constraint = "sale_start < sale_end")
})
public class TicketType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "performance_id", nullable = false)
    private Long performanceId;
    @Column(nullable = false, length = 50)
    private String name;
    @Column(nullable = false, check = @CheckConstraint(constraint = "price >= 0"))
    private BigDecimal price;
    @Column(nullable = false, check = @CheckConstraint(constraint = "total_quantity > 0"))
    private Integer totalQuantity;
    @Column(check = @CheckConstraint(constraint = "sold_quantity >= 0"))
    @ColumnDefault("0")
    private Integer soldQuantity = 0;
    @Column(check = @CheckConstraint(constraint = "reserved_quantity >= 0"))
    @ColumnDefault("0")
    private Integer reservedQuantity = 0;
    @Column(name = "max_tickets_per_user", nullable = false)
    private Integer maxTicketsPerUser;
    @Column(name = "sale_start", nullable = false)
    private LocalDateTime saleStart;
    @Column(name = "sale_end", nullable = false)
    private LocalDateTime saleEnd;
    @Version
    private Long version;
}
