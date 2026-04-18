package fit.iuh.order_service.entities;

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
@Table(name = "order_items")
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(nullable = false)
    private Long ticketTypeId;

    @Column(nullable = false, check = @CheckConstraint(constraint = "quantity > 0"))
    private Integer quantity;

    @Column(nullable = false, check = @CheckConstraint(constraint = "unit_price >= 0"))
    private BigDecimal unitPrice;
}
