package fit.iuh.payment_service.providers.vnpay.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "payment.vnpay.secret")
public class VnPaySecretProperties {
    private String tmnCode;
    private String hashSecret;
}
