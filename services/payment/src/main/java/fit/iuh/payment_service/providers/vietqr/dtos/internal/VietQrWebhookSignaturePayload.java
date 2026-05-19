package fit.iuh.payment_service.providers.vietqr.dtos.internal;

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
public class VietQrWebhookSignaturePayload {
    private Long paymentId;
    private String paymentToken;
    private String providerTransactionId;
    private String status;
}
