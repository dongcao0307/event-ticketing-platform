package fit.iuh.payment_service.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "refund_requests")
public class RefundRequest {

    @Id
    @Column(nullable = false, length = 64)
    private String id;

    @Column(nullable = false)
    private Long orderId;

    @Column(nullable = true)
    private Long paymentId;

    @Column(nullable = true)
    private BigDecimal amount;

    @Column(nullable = true, length = 500)
    private String reason;

    @Column(nullable = true, unique = true, length = 120)
    private String idempotencyKey;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private RefundStatus status;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
