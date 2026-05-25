package fit.iuh.event_service.redis;

public final class EventReservationKeys {
    public static final String RESERVATION_DATA_PREFIX = "event:reservation:data:";
    public static final String RESERVATION_TTL_PREFIX = "event:reservation:ttl:";

    private EventReservationKeys() {
    }

    public static String dataKey(Long bookingId) {
        return RESERVATION_DATA_PREFIX + bookingId;
    }

    public static String ttlKey(Long bookingId) {
        return RESERVATION_TTL_PREFIX + bookingId;
    }
}
