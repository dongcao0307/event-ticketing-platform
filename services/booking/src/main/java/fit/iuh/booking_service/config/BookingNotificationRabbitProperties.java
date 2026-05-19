package fit.iuh.booking_service.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "booking.notification.messaging")
public class BookingNotificationRabbitProperties {
    private Boolean enabled;
    private String exchange;
    private String routingKey;
}
