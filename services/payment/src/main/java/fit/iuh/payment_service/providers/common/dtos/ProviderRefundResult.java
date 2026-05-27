package fit.iuh.payment_service.providers.common.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProviderRefundResult {
    private boolean success;
    private String providerName;
    private String providerTransactionId;
    private String message;
    private BigDecimal refundedAmount;
}
