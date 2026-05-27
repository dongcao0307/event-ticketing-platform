package fit.iuh.payment_service.messaging;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(prefix = "booking.lifecycle.messaging", name = "enabled", havingValue = "false", matchIfMissing = true)
public class NoOpBookingLifecyclePublisher implements BookingLifecyclePublisher {
    @Override
    public void publishBookingCancelled(BookingCancelledEvent event) {
        // no-op when booking lifecycle messaging is disabled
    }
}
