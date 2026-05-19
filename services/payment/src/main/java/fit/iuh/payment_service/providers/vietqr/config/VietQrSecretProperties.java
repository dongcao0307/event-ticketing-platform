package fit.iuh.payment_service.providers.vietqr.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "payment.vietqr.secret")
public class VietQrSecretProperties {
    private String apiKey;
    private String clientId;
    private String checksumKey;
    private String webhookSecret;
}
