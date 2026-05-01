package fit.iuh.payment_service.providers.momo.dtos.requests;

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
public class MoMoIpnRequest {
    @NotBlank
    private String partnerCode;

    @NotBlank
    private String requestId;

    @NotBlank
    private String orderId;

    @NotBlank
    private String amount;

    @NotNull
    private Integer resultCode;

    @NotBlank
    private String message;

    private String orderInfo;
    private String orderType;
    private String transId;
    private String responseTime;
    private String payType;
    private String extraData;

    @NotBlank
    private String signature;

    private String rawResponse;
}
