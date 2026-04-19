package fit.iuh.order_service.redis;

import fit.iuh.order_service.entities.Order;
import fit.iuh.order_service.entities.OrderStatus;
import fit.iuh.order_service.repositories.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OrderExpiryHandler {
    private final OrderRepository orderRepository;

    @Transactional
    public void handleExpiredKey(String expiredKey) {
        if (expiredKey == null || !expiredKey.startsWith(OrderRedisKeys.ORDER_EXPIRE_KEY_PREFIX)) {
            return;
        }

        String idPart = expiredKey.substring(OrderRedisKeys.ORDER_EXPIRE_KEY_PREFIX.length());
        Long orderId;
        try {
            orderId = Long.parseLong(idPart);
        } catch (NumberFormatException ex) {
            return;
        }

        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return;
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            return;
        }

        // Only expire if we reached the business time.
        if (order.getExpiredAt() != null && order.getExpiredAt().isAfter(LocalDateTime.now())) {
            return;
        }

        order.setStatus(OrderStatus.EXPIRED);
        order.setVersion(order.getVersion() == null ? 1L : order.getVersion() + 1);
        orderRepository.save(order);
    }
}
