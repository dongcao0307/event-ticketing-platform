package fit.iuh.payment_service.providers.vnpay.dtos.responses;

import fit.iuh.payment_service.entities.PaymentStatus;
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
public class VnPayCreatePaymentResponse {
    private Long paymentId;
    private String paymentToken;
    private String initTransactionId;
    private String providerName;
    private String txnRef;
    private String paymentUrl;
    private LocalDateTime expiresAt;
    private PaymentStatus status;
}
