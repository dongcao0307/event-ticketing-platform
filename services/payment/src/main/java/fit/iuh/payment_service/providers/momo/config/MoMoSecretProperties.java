package fit.iuh.payment_service.providers.momo.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "payment.momo.secret")
public class MoMoSecretProperties {
    private String partnerCode;
    private String accessKey;
    private String secretKey;
}
