package fit.iuh.payment_service.providers.vnpay.dtos.requests;

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
public class VnPayIpnRequest {
    @NotNull
    private Long paymentId;

    @NotBlank
    private String paymentToken;

    @NotBlank
    private String txnRef;

    @NotBlank
    private String transactionNo;

    @NotBlank
    private String responseCode;

    @NotBlank
    private String amount;

    private String rawResponse;

    @NotBlank
    private String secureHash;
}
