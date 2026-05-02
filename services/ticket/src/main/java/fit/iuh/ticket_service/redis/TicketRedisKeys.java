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
}
