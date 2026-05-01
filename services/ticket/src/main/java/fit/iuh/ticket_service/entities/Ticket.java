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
@Table(name = "tickets")
public class Ticket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "ticket_type_id")
    private TicketType ticketType;
    @Column(nullable = false)
    private Long performanceId;
    @Column(nullable = false)
    private Long userId;
    @Column(nullable = false)
    private Long orderId;
    @Column(nullable = false, unique = true)
    private String qrCode;
    @Column(nullable = false, check = @CheckConstraint(constraint = "price_at_purchase >= 0"))
    private BigDecimal priceAtPurchase;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TicketStatus ticketStatus;
    @Column(length = 50)
    private String seatNumber;
    private LocalDateTime checkInAt;
}
