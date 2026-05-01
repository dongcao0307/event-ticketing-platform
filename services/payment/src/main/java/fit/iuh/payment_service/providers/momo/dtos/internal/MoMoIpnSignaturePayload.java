package fit.iuh.payment_service.providers.momo.dtos.internal;

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
public class MoMoIpnSignaturePayload {
    private String partnerCode;
    private String accessKey;
    private String requestId;
    private String amount;
    private String orderId;
    private String orderInfo;
    private String orderType;
    private String transId;
    private String message;
    private String responseTime;
    private String resultCode;
    private String payType;
    private String extraData;
}
