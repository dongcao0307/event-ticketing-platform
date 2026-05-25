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
@ConditionalOnProperty(prefix = "notification.payment.messaging", name = "enabled", havingValue = "true")
public class PaymentNotificationListener {
    private final NotificationOrchestratorService orchestratorService;

    @RabbitListener(queues = "${notification.payment.messaging.queue}", containerFactory = "notificationListenerContainerFactory")
    @CircuitBreaker(name = "notificationConsumer", fallbackMethod = "onPaymentNotificationFallback")
    public void onPaymentNotification(PaymentNotificationEvent event) {
        if (event == null || event.getOrderId() == null) {
            log.warn("Ignored payment notification event with missing orderId");
            return;
        }
        try {
            orchestratorService.handlePaymentNotification(event);
        } catch (AppException ex) {
            if (isNonRetryable(ex)) {
                throw new AmqpRejectAndDontRequeueException(ex);
            }
            throw ex;
        }
    }

    protected void onPaymentNotificationFallback(PaymentNotificationEvent event, Throwable throwable) {
        throw new AmqpRejectAndDontRequeueException("Notification consumer circuit open", throwable);
    }

    private boolean isNonRetryable(AppException ex) {
        return ex.getErrorCode() == ErrorCode.RECIPIENT_NOT_FOUND
                || ex.getErrorCode() == ErrorCode.TEMPLATE_NOT_FOUND;
    }
}
