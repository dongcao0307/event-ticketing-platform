package fit.iuh.notification_service.redis;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import fit.iuh.notification_service.services.payload.BookingSnapshot;
import fit.iuh.notification_service.services.payload.PaymentSnapshot;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationRedisStore {
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    public void storePaymentSnapshot(PaymentSnapshot snapshot, Duration ttl) {
        if (snapshot == null || snapshot.getOrderId() == null) {
            return;
        }
        String key = NotificationRedisKeys.paymentKey(snapshot.getOrderId());
        storeJson(key, snapshot, ttl);
    }

    public Optional<PaymentSnapshot> getPaymentSnapshot(Long orderId) {
        return readJson(NotificationRedisKeys.paymentKey(orderId), PaymentSnapshot.class);
    }

    public void deletePaymentSnapshot(Long orderId) {
        redisTemplate.delete(NotificationRedisKeys.paymentKey(orderId));
    }

    public void storeBookingSnapshot(BookingSnapshot snapshot, Duration ttl) {
        if (snapshot == null || snapshot.getBookingId() == null) {
            return;
        }
        String key = NotificationRedisKeys.bookingKey(snapshot.getBookingId());
        storeJson(key, snapshot, ttl);
    }

    public Optional<BookingSnapshot> getBookingSnapshot(Long orderId) {
        return readJson(NotificationRedisKeys.bookingKey(orderId), BookingSnapshot.class);
    }

    public void deleteBookingSnapshot(Long orderId) {
        redisTemplate.delete(NotificationRedisKeys.bookingKey(orderId));
    }

    public boolean markScheduled(Long orderId, Duration ttl) {
        String key = NotificationRedisKeys.scheduledKey(orderId);
        Boolean stored = redisTemplate.opsForValue().setIfAbsent(key, "1", ttl);
        return Boolean.TRUE.equals(stored);
    }

    public void markSent(Long orderId, Duration ttl) {
        redisTemplate.opsForValue().set(NotificationRedisKeys.sentKey(orderId), "1", ttl);
    }

    public boolean isSent(Long orderId) {
        Boolean exists = redisTemplate.hasKey(NotificationRedisKeys.sentKey(orderId));
        return Boolean.TRUE.equals(exists);
    }

    private <T> void storeJson(String key, T value, Duration ttl) {
        try {
            String json = objectMapper.writeValueAsString(value);
            redisTemplate.opsForValue().set(key, json, ttl);
        } catch (JsonProcessingException ex) {
            log.warn("Failed to serialize notification payload for key {}", key, ex);
        }
    }

    private <T> Optional<T> readJson(String key, Class<T> clazz) {
        String json = redisTemplate.opsForValue().get(key);
        if (json == null || json.isBlank()) {
            return Optional.empty();
        }
        try {
            return Optional.of(objectMapper.readValue(json, clazz));
        } catch (Exception ex) {
            log.warn("Failed to deserialize notification payload for key {}", key, ex);
            return Optional.empty();
        }
    }
}
