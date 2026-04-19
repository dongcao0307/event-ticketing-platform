package fit.iuh.ticket_service.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Entity
@Table(name = "ticket_types")
public class TicketType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private Long performanceId;
    @Column(nullable = false, length = 50)
    private String name;
    @Column(nullable = false, check = @CheckConstraint(constraint = "price >= 0"))
    private BigDecimal price;
    @Column(nullable = false, check = @CheckConstraint(constraint = "total_quantity > 0"))
    private Integer totalQuantity;
    @Column(nullable = false, check = @CheckConstraint(constraint = "sold_quantity >= 0"))
    private Integer soldQuantity;
    @Column(nullable = false, check = @CheckConstraint(constraint = "reserved_quantity >= 0"))
    private Integer reservedQuantity;
    @Column(nullable = false, check = @CheckConstraint(constraint = "max_tickets_per_user > 0"))
    private Integer maxTicketsPerUser;
    @Column(nullable = false)
    private Long version;
}
