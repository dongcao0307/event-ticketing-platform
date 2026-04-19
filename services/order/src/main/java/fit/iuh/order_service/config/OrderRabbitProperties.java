package fit.iuh.order_service.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "order.messaging")
public class OrderRabbitProperties {
    private Boolean enabled;
    private String exchange;
    private String routingKey;
    private String queue;
}
