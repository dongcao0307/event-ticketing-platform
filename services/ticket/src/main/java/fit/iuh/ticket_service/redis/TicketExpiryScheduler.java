package fit.iuh.ticket_service.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class TicketExpiryScheduler {
    private final StringRedisTemplate stringRedisTemplate;

    @Value("${ticket.expire.minutes:15}")
    private long expireMinutes;

    public void schedule(Long ticketId, Duration ttl) {
        if (ttl == null || ttl.isZero() || ttl.isNegative()) {
            // set a very small TTL to trigger expiration quickly
            ttl = Duration.ofSeconds(1);
        }
        String key = TicketRedisKeys.expireKey(ticketId);
        stringRedisTemplate.opsForValue().set(key, "1", ttl);
    }

    public void scheduleDefault(Long ticketId) {
        schedule(ticketId, Duration.ofMinutes(expireMinutes));
    }

    public void cancel(Long ticketId) {
        String key = TicketRedisKeys.expireKey(ticketId);
        stringRedisTemplate.delete(key);
    }
}
