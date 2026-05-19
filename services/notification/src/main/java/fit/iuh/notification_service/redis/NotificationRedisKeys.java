package fit.iuh.notification_service.redis;

public final class NotificationRedisKeys {
    private static final String PAYMENT_PREFIX = "notification:payment:";
    private static final String BOOKING_PREFIX = "notification:booking:";
    private static final String SENT_PREFIX = "notification:sent:";
    private static final String SCHEDULED_PREFIX = "notification:scheduled:";

    private NotificationRedisKeys() {
    }

    public static String paymentKey(Long orderId) {
        return PAYMENT_PREFIX + orderId;
    }

    public static String bookingKey(Long orderId) {
        return BOOKING_PREFIX + orderId;
    }

    public static String sentKey(Long orderId) {
        return SENT_PREFIX + orderId;
    }

    public static String scheduledKey(Long orderId) {
        return SCHEDULED_PREFIX + orderId;
    }
}
