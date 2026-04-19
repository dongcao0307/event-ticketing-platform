package fit.iuh.payment_service.providers.vietqr.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.math.BigDecimal;

@Getter
@Setter
@ConfigurationProperties(prefix = "payment.vietqr")
public class VietQrProperties {
    private String providerName;
    private Boolean sandboxEnabled;
    private String qrBaseUrl;
    private Integer qrExpiredMinutes;
    private BigDecimal feeRatePercent;
    private Boolean signatureRequired;
}
