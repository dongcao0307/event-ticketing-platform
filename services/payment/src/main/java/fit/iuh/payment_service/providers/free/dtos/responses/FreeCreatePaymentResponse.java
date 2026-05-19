package fit.iuh.payment_service.providers.free.dtos.responses;

import fit.iuh.payment_service.entities.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FreeCreatePaymentResponse {
    private Long paymentId;
    private String paymentToken;
    private String initTransactionId;
    private String providerName;
    private PaymentStatus status;
}
