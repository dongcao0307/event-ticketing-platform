package fit.iuh.booking_service.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class BookingExpiryScheduler {
    private final StringRedisTemplate stringRedisTemplate;

    @Value("${booking.expire.minutes:17}")
    private long expireMinutes;

    public void schedule(Long bookingId, Duration ttl) {
        if (ttl == null || ttl.isZero() || ttl.isNegative()) {
            // set a very small TTL to trigger expiration quickly
            ttl = Duration.ofSeconds(1);
        }
        String key = BookingRedisKeys.expireKey(bookingId);
        stringRedisTemplate.opsForValue().set(key, "1", ttl);
    }

    public void scheduleDefault(Long bookingId) {
        schedule(bookingId, Duration.ofMinutes(expireMinutes));
    }

    public void cancel(Long bookingId) {
        String key = BookingRedisKeys.expireKey(bookingId);
        stringRedisTemplate.delete(key);
    }
}
