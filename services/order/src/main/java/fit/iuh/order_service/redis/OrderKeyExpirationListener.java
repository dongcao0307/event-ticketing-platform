package fit.iuh.order_service.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderKeyExpirationListener implements MessageListener {
    private final OrderExpiryHandler orderExpiryHandler;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        String expiredKey = message.toString();
        orderExpiryHandler.handleExpiredKey(expiredKey);
    }
}
