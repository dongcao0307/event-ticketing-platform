package fit.iuh.ticket_service.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TicketKeyExpirationListener implements MessageListener {
    private final TicketExpiryHandler ticketExpiryHandler;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        String expiredKey = message.toString();
        ticketExpiryHandler.handleExpiredKey(expiredKey);
    }
}
