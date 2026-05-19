package fit.iuh.notification_service.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "notification.booking.messaging")
public class NotificationBookingRabbitProperties {
    private Boolean enabled;
    private String exchange;
    private String routingKey;
    private String queue;
}
