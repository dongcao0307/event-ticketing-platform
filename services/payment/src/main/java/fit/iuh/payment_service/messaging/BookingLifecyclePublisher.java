package fit.iuh.payment_service.messaging;

public interface BookingLifecyclePublisher {
    void publishBookingCancelled(BookingCancelledEvent event);
}
