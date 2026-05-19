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
@ConditionalOnProperty(prefix = "notification.payment.messaging", name = "enabled", havingValue = "true")
public class PaymentNotificationListener {
    private final NotificationOrchestratorService orchestratorService;

    @RabbitListener(queues = "${notification.payment.messaging.queue}")
    public void onPaymentNotification(PaymentNotificationEvent event) {
        if (event == null || event.getOrderId() == null) {
            log.warn("Ignored payment notification event with missing orderId");
            return;
        }
        orchestratorService.handlePaymentNotification(event);
    }
}
