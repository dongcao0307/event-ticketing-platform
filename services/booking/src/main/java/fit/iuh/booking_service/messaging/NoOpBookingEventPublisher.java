package fit.iuh.booking_service.messaging;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(prefix = "booking.messaging", name = "enabled", havingValue = "false", matchIfMissing = true)
public class NoOpBookingEventPublisher implements BookingEventPublisher {
    @Override
    public void publishBookingPaid(BookingPaidEvent event) {
        // Intentionally left blank when booking messaging is disabled.
    }
}
