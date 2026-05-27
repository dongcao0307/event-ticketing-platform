package fit.iuh.event_service.configs;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "booking.lifecycle.messaging")
public class BookingLifecycleRabbitProperties {
    private Boolean enabled;
    private String exchange;
    private String createdRoutingKey;
    private String cancelledRoutingKey;
    private String createdQueue;
    private String cancelledQueue;
}
