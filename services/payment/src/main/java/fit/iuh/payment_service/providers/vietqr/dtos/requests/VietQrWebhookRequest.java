package fit.iuh.payment_service.providers.vietqr.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class VietQrWebhookRequest {
    @NotNull
    private Long paymentId;

    @NotBlank
    private String paymentToken;

    @NotBlank
    private String providerTransactionId;

    @NotBlank
    private String status;

    private String providerResponse;

    @NotBlank
    private String signature;
}
