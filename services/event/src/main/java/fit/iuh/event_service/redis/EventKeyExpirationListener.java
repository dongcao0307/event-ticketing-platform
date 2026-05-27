package fit.iuh.event_service.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EventKeyExpirationListener implements MessageListener {
    private final EventReservationExpiryHandler reservationExpiryHandler;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        String expiredKey = message.toString();
        reservationExpiryHandler.handleExpiredKey(expiredKey);
    }
}
