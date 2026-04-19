package fit.iuh.payment_service.messaging;

public interface PaymentEventPublisher {
    void publishPaymentStatusChanged(PaymentStatusChangedEvent event);
}
