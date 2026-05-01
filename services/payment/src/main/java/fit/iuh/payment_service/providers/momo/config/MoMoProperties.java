package fit.iuh.payment_service.providers.momo.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.math.BigDecimal;

@Getter
@Setter
@ConfigurationProperties(prefix = "payment.momo")
public class MoMoProperties {
    private String providerName;
    private Boolean sandboxEnabled;
    private String createEndpoint;
    private String returnUrl;
    private String ipnUrl;
    private Integer expireMinutes;
    private BigDecimal feeRatePercent;
    private String requestType;
    private String lang;
    private Boolean autoCapture;
    private Boolean signatureRequired;
}
