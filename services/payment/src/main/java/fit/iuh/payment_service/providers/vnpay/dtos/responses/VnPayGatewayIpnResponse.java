package fit.iuh.payment_service.providers.vnpay.dtos.responses;

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
public class VnPayGatewayIpnResponse {
    private String rspCode;
    private String message;
}
