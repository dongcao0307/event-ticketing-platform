package fit.iuh.notification_service.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

@Getter
@Setter
@ConfigurationProperties(prefix = "notification.listener.retry")
public class NotificationListenerProperties {
    private Integer maxAttempts;
    private Duration initialInterval;
    private Double multiplier;
    private Duration maxInterval;
}
