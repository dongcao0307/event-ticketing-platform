package fit.iuh.event_service.configs;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "ticket.reservation.messaging")
public class TicketReservationRabbitProperties {
    private Boolean enabled;
    private String exchange;
    private String reservedRoutingKey;
    private String failedRoutingKey;
    private String reservedQueue;
    private String failedQueue;
}
