package fit.iuh.payment_service.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@Entity
@Table(name = "payment_callback_logs")
public class PaymentCallbackLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 30)
    private String provider;

    @Column(nullable = true)
    private Long paymentId;

    @Column(nullable = true, length = 120)
    private String paymentReference;

    @Column(nullable = true, length = 120)
    private String providerTransactionId;

    @Column(nullable = false, length = 255)
    private String sourcePath;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String callbackUrl;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String rawQueryString;

    @Column(nullable = false, columnDefinition = "LONGTEXT")
    private String rawPayload;

    @Column(nullable = false)
    private LocalDateTime receivedAt;
}