package fit.iuh.booking_service.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;

@Configuration
@RequiredArgsConstructor
public class RedisKeyspaceEventsConfig {
    private final RedisConnectionFactory redisConnectionFactory;
    private final BookingKeyExpirationListener bookingKeyExpirationListener;

    @Bean
    public RedisMessageListenerContainer redisMessageListenerContainer() {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(redisConnectionFactory);
        container.addMessageListener(bookingKeyExpirationListener, new PatternTopic("__keyevent@*__:expired"));
        return container;
    }
}
