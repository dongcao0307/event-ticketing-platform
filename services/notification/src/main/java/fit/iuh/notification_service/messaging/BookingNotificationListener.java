package fit.iuh.notification_service.messaging;

import fit.iuh.notification_service.services.NotificationOrchestratorService;
import fit.iuh.notification_service.exceptions.AppException;
import fit.iuh.notification_service.exceptions.ErrorCode;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.AmqpRejectAndDontRequeueException;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "notification.booking.messaging", name = "enabled", havingValue = "true")
public class BookingNotificationListener {
    private final NotificationOrchestratorService orchestratorService;

    @RabbitListener(queues = "${notification.booking.messaging.queue}", containerFactory = "notificationListenerContainerFactory")
    @CircuitBreaker(name = "notificationConsumer", fallbackMethod = "onBookingNotificationFallback")
    public void onBookingNotification(BookingNotificationEvent event) {
        if (event == null || event.getBookingId() == null) {
            log.warn("Ignored booking notification event with missing bookingId");
            return;
        }
        try {
            orchestratorService.handleBookingNotification(event);
        } catch (AppException ex) {
            if (isNonRetryable(ex)) {
                throw new AmqpRejectAndDontRequeueException(ex);
            }
            throw ex;
        }
    }

    protected void onBookingNotificationFallback(BookingNotificationEvent event, Throwable throwable) {
        throw new AmqpRejectAndDontRequeueException("Notification consumer circuit open", throwable);
    }

    private boolean isNonRetryable(AppException ex) {
        return ex.getErrorCode() == ErrorCode.RECIPIENT_NOT_FOUND
                || ex.getErrorCode() == ErrorCode.TEMPLATE_NOT_FOUND;
    }
}
