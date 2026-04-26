package fit.iuh.ticket_service.redis;

public final class TicketRedisKeys {
    private TicketRedisKeys() {}

    public static final String TICKET_EXPIRE_KEY_PREFIX = "ticket:expire:";

    public static String expireKey(Long ticketId) {
        return TICKET_EXPIRE_KEY_PREFIX + ticketId;
    }
}
