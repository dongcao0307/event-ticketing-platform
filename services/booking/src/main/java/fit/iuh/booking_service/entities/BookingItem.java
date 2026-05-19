package fit.iuh.booking_service.entities;

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
@Table(name = "booking_items")
public class BookingItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Column(nullable = false)
    private Long ticketTypeId;

    @Column(nullable = false, check = @CheckConstraint(constraint = "quantity > 0"))
    private Integer quantity;

    @Column(nullable = false, check = @CheckConstraint(constraint = "unit_price >= 0"))
    private BigDecimal unitPrice;
}
