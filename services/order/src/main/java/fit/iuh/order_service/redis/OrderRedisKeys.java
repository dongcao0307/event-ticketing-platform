package fit.iuh.order_service.redis;

public final class OrderRedisKeys {
    private OrderRedisKeys() {}

    public static final String ORDER_EXPIRE_KEY_PREFIX = "order:expire:";

    public static String expireKey(Long orderId) {
        return ORDER_EXPIRE_KEY_PREFIX + orderId;
    }
}
