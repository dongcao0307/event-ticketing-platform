package fit.iuh.payment_service.providers.momo.dtos.responses;

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
public class MoMoIpnResponse {
    private Long paymentId;
    private PaymentStatus status;
    private String transactionId;
    private String providerTransactionId;
    private Integer resultCode;
    private String message;
}
