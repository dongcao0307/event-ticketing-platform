package fit.iuh.ticket_service.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Entity
@Table(name = "ticket_types", check = {
        @CheckConstraint(constraint = "min_tickets_per_user < max_tickets_per_user"),
        @CheckConstraint(constraint = "sell_from < sell_to")
})
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
    @Column(nullable = false, check = @CheckConstraint(constraint = "min_tickets_per_user > 0"))
    private Integer minTicketsPerUser;
    @Column(nullable = false)
    private Integer maxTicketsPerUser;
    @Column(nullable = false)
    private LocalDateTime sellFrom;
    @Column(nullable = false)
    private LocalDateTime sellTo;
    @Column(length = 2000)
    private String description;
    @Column(length = 500)
    private String imageUrl;
    @Column(nullable = false)
    private Long version;
}
