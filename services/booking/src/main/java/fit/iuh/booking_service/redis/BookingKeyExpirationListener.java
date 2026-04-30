package fit.iuh.booking_service.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class BookingKeyExpirationListener implements MessageListener {
    private final BookingExpiryHandler bookingExpiryHandler;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        String expiredKey = message.toString();
        bookingExpiryHandler.handleExpiredKey(expiredKey);
    }
}
