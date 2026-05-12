package fit.iuh.ticket_service.redis;

public final class TicketRedisKeys {
    private TicketRedisKeys() {}

    public static final String TICKET_EXPIRE_KEY_PREFIX = "ticket:expire:";
    public static final String BOOKED_SEATS_KEY_PREFIX = "ticket:booked-seats:";

    public static String expireKey(Long ticketId) {
        return TICKET_EXPIRE_KEY_PREFIX + ticketId;
    }

    public static String bookedSeatsKey(Long performanceId) {
        return BOOKED_SEATS_KEY_PREFIX + performanceId;
    }

    public static Long extractPerformanceIdFromExpireKey(String expireKey) {
        if (expireKey == null || !expireKey.startsWith(TICKET_EXPIRE_KEY_PREFIX)) {
            return null;
        }
        try {
            return Long.parseLong(expireKey.substring(TICKET_EXPIRE_KEY_PREFIX.length()));
        } catch (NumberFormatException ex) {
            return null;
        }
    }
}
