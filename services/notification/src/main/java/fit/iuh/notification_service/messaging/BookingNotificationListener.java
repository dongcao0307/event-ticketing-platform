package fit.iuh.notification_service.messaging;

import fit.iuh.notification_service.services.NotificationOrchestratorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "notification.booking.messaging", name = "enabled", havingValue = "true")
public class BookingNotificationListener {
    private final NotificationOrchestratorService orchestratorService;

    @RabbitListener(queues = "${notification.booking.messaging.queue}")
    public void onBookingNotification(BookingNotificationEvent event) {
        if (event == null || event.getBookingId() == null) {
            log.warn("Ignored booking notification event with missing bookingId");
            return;
        }
        orchestratorService.handleBookingNotification(event);
    }
}
