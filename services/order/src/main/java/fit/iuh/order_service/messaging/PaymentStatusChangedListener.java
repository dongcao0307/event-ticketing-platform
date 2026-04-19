package fit.iuh.order_service.messaging;

import fit.iuh.order_service.dtos.requests.UpdateOrderStatusRequest;
import fit.iuh.order_service.entities.OrderStatus;
import fit.iuh.order_service.services.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "payment.messaging", name = "enabled", havingValue = "true")
public class PaymentStatusChangedListener {
    private final OrderService orderService;

    @RabbitListener(queues = "${payment.messaging.queue}")
    public void onPaymentStatusChanged(PaymentStatusChangedEvent event) {
        if (event == null || event.getOrderId() == null || event.getStatus() == null) {
            return;
        }

        if (!"COMPLETED".equalsIgnoreCase(event.getStatus())) {
            return;
        }

        try {
            orderService.updateOrderStatus(
                    event.getOrderId(),
                    UpdateOrderStatusRequest.builder().status(OrderStatus.PAID).build()
            );
            log.info("Order {} marked as PAID from payment event {}", event.getOrderId(), event.getPaymentId());
        } catch (Exception ex) {
            log.error("Failed to mark order {} as PAID from payment event", event.getOrderId(), ex);
            throw ex;
        }
    }
}
