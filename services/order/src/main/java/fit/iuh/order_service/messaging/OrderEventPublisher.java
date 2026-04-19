package fit.iuh.order_service.messaging;

public interface OrderEventPublisher {
    void publishOrderPaid(OrderPaidEvent event);
}
