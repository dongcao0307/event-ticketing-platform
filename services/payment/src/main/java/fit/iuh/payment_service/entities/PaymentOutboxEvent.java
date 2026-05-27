package fit.iuh.payment_service.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "payment_outbox_events")
public class PaymentOutboxEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 80)
    private String aggregateType;

    @Column(nullable = false, length = 80)
    private String aggregateId;

    @Column(nullable = false, length = 80)
    private String eventType;

    @Lob
    @Column(nullable = false)
    private String payload;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PaymentOutboxStatus status;

    @Column(nullable = false)
    private int retryCount;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private LocalDateTime publishedAt;

    @Column(length = 500)
    private String lastError;
}
