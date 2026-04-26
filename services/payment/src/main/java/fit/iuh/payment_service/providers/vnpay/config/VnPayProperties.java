package fit.iuh.payment_service.providers.vnpay.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.math.BigDecimal;

@Getter
@Setter
@ConfigurationProperties(prefix = "payment.vnpay")
public class VnPayProperties {
    private String providerName;
    private Boolean sandboxEnabled;
    private String payUrl;
    private String returnUrl;
    private Integer expireMinutes;
    private BigDecimal feeRatePercent;
    private String version;
    private String command;
    private String currCode;
    private String locale;
}
