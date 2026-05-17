package fit.iuh.payment_service.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "payment.messaging")
public class RabbitMqProperties {
    private Boolean enabled;
    private String exchange;
    private String routingKey;
}
