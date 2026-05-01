package fit.iuh.booking_service.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "payment.messaging")
public class PaymentRabbitProperties {
    private Boolean enabled;
    private String exchange;
    private String routingKey;
    private String queue;
}
