package fit.iuh.booking_service.messaging;

public interface BookingEventPublisher {
    void publishBookingPaid(BookingPaidEvent event);
}
