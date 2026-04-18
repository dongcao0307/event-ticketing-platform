package fit.iuh.order_service.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class OrderExpiryScheduler {
    private final StringRedisTemplate stringRedisTemplate;

    @Value("${order.expire.minutes:17}")
    private long expireMinutes;

    public void schedule(Long orderId, Duration ttl) {
        if (ttl == null || ttl.isZero() || ttl.isNegative()) {
            // set a very small TTL to trigger expiration quickly
            ttl = Duration.ofSeconds(1);
        }
        String key = OrderRedisKeys.expireKey(orderId);
        stringRedisTemplate.opsForValue().set(key, "1", ttl);
    }

    public void scheduleDefault(Long orderId) {
        schedule(orderId, Duration.ofMinutes(expireMinutes));
    }

    public void cancel(Long orderId) {
        String key = OrderRedisKeys.expireKey(orderId);
        stringRedisTemplate.delete(key);
    }
}
