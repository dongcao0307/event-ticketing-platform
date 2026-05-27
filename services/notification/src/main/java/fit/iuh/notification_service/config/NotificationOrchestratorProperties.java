package fit.iuh.notification_service.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

@Getter
@Setter
@ConfigurationProperties(prefix = "notification.orchestrator")
public class NotificationOrchestratorProperties {
    private Duration mergeTtl;
    private Duration sentTtl;
    private Duration scheduleTtl;
}
