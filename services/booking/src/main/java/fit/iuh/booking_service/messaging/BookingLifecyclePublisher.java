package fit.iuh.booking_service.messaging;

public interface BookingLifecyclePublisher {
    void publishBookingCreated(BookingCreatedEvent event);

    void publishBookingCancelled(BookingCancelledEvent event);
}
