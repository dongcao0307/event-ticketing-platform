package fit.iuh.booking_service.redis;

public final class BookingRedisKeys {
    private BookingRedisKeys() {}

    public static final String BOOKING_EXPIRE_KEY_PREFIX = "booking:expire:";

    public static String expireKey(Long bookingId) {
        return BOOKING_EXPIRE_KEY_PREFIX + bookingId;
    }
}
