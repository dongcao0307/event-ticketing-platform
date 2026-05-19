package fit.iuh.order_service.services.impl;

import fit.iuh.order_service.dtos.requests.AddOrderItemRequest;
import fit.iuh.order_service.dtos.requests.CreateOrderRequest;
import fit.iuh.order_service.dtos.requests.UpdateOrderStatusRequest;
import fit.iuh.order_service.dtos.responses.OrderResponse;
import fit.iuh.order_service.entities.Order;
import fit.iuh.order_service.entities.OrderItem;
import fit.iuh.order_service.entities.OrderStatus;
import fit.iuh.order_service.exceptions.AppException;
import fit.iuh.order_service.exceptions.ErrorCode;
import fit.iuh.order_service.exceptions.PostException;
import fit.iuh.order_service.messaging.OrderEventPublisher;
import fit.iuh.order_service.messaging.OrderPaidEvent;
import fit.iuh.order_service.mappers.OrderMapper;
import fit.iuh.order_service.redis.OrderExpiryScheduler;
import fit.iuh.order_service.repositories.OrderRepository;
import fit.iuh.order_service.services.OrderService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final OrderExpiryScheduler orderExpiryScheduler;
    private final OrderEventPublisher orderEventPublisher;

    @Value("${order.expire.minutes:17}")
    private long expireMinutes;

    @Override
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        validateRequest(request);

        Order existed = orderRepository.findByIdempotenceKey(request.getIdempotenceKey()).orElse(null);
        if (existed != null) {
            ensureExpiryKey(existed);
            return orderMapper.toOrderResponse(existed);
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiredAt = now.plusMinutes(expireMinutes);

        BigDecimal discount = request.getDiscountAmount() == null ? BigDecimal.ZERO : request.getDiscountAmount();
        if (discount.compareTo(BigDecimal.ZERO) < 0) {
            throw new AppException(ErrorCode.INVALID_POST_REQUEST);
        }

        Order order = Order.builder()
                .userId(request.getUserId())
                .idempotenceKey(request.getIdempotenceKey())
                .subtotal(BigDecimal.ZERO)
                .discountAmount(discount)
                .totalAmount(BigDecimal.ZERO)
                .status(OrderStatus.PENDING)
                .createdAt(now)
                .expiredAt(expiredAt)
                .version(1L)
                .build();

        Order saved = orderRepository.save(order);
        orderExpiryScheduler.schedule(saved.getId(), Duration.ofMinutes(expireMinutes));

        return orderMapper.toOrderResponse(saved);
    }

    @Override
    @Transactional
    public OrderResponse addOrderItems(Long orderId, List<AddOrderItemRequest> requests) {
        validateBatchRequest(requests);

        Order order = orderRepository.findById(orderId).orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        if (order.getStatus() != OrderStatus.PENDING) {
            throw new AppException(ErrorCode.ORDER_NOT_PENDING);
        }

        for (AddOrderItemRequest request : requests) {
            if (request.getUnitPrice() != null && request.getUnitPrice().compareTo(BigDecimal.ZERO) < 0) {
                throw new AppException(ErrorCode.INVALID_POST_REQUEST);
            }

            OrderItem item = OrderItem.builder()
                    .order(order)
                    .ticketTypeId(request.getTicketTypeId())
                    .quantity(request.getQuantity())
                    .unitPrice(request.getUnitPrice())
                    .build();

            order.getItems().add(item);
        }

        recomputeTotals(order);
        order.setVersion(order.getVersion() == null ? 1L : order.getVersion() + 1);

        Order saved = orderRepository.save(order);
        ensureExpiryKey(saved);
        return orderMapper.toOrderResponse(saved);
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request) {
        validateRequest(request);

        Order order = orderRepository.findById(orderId).orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        OrderStatus oldStatus = order.getStatus();
        OrderStatus newStatus = request.getStatus();

        if (oldStatus == newStatus) {
            if (newStatus == OrderStatus.PAID || newStatus == OrderStatus.CANCELLED) {
                orderExpiryScheduler.cancel(orderId);
            }
            return orderMapper.toOrderResponse(order);
        }

        order.setStatus(newStatus);
        order.setVersion(order.getVersion() == null ? 1L : order.getVersion() + 1);
        Order saved = orderRepository.save(order);

        if (newStatus == OrderStatus.PAID || newStatus == OrderStatus.CANCELLED) {
            orderExpiryScheduler.cancel(orderId);
        }

        if (newStatus == OrderStatus.PAID) {
            orderEventPublisher.publishOrderPaid(toOrderPaidEvent(saved));
        }

        return orderMapper.toOrderResponse(saved);
    }

    @Override
    public OrderResponse findById(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        return orderMapper.toOrderResponse(order);
    }

    private void recomputeTotals(Order order) {
        BigDecimal subtotal = BigDecimal.ZERO;
        for (OrderItem item : order.getItems()) {
            if (item.getUnitPrice() == null || item.getQuantity() == null) {
                continue;
            }
            subtotal = subtotal.add(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }
        order.setSubtotal(subtotal);

        BigDecimal discount = order.getDiscountAmount() == null ? BigDecimal.ZERO : order.getDiscountAmount();
        if (discount.compareTo(BigDecimal.ZERO) < 0) {
            discount = BigDecimal.ZERO;
        }
        order.setDiscountAmount(discount);

        BigDecimal total = subtotal.subtract(discount);
        if (total.compareTo(BigDecimal.ZERO) < 0) {
            total = BigDecimal.ZERO;
        }
        order.setTotalAmount(total);
    }

    private <T> void validateRequest(T request) {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        factory.close();
        Set<ConstraintViolation<T>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            throw new PostException(violations);
        }
    }

    private <T> void validateBatchRequest(List<T> requests) {
        if (requests == null || requests.isEmpty()) {
            throw new PostException(Collections.emptySet(), Map.of("requests", "requests must not be empty"));
        }

        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        factory.close();

        Map<String, String> errors = new LinkedHashMap<>();
        for (int i = 0; i < requests.size(); i++) {
            T request = requests.get(i);
            if (request == null) {
                errors.put("requests[" + i + "]", "request must not be null");
                continue;
            }
            Set<ConstraintViolation<T>> violations = validator.validate(request);
            for (ConstraintViolation<T> violation : violations) {
                errors.put("requests[" + i + "]." + violation.getPropertyPath(), violation.getMessage());
            }
        }

        if (!errors.isEmpty()) {
            throw new PostException(Collections.emptySet(), errors);
        }
    }

    private void ensureExpiryKey(Order order) {
        if (order == null || order.getId() == null) {
            return;
        }

        if (order.getStatus() != OrderStatus.PENDING) {
            return;
        }

        LocalDateTime expiredAt = order.getExpiredAt();
        if (expiredAt == null) {
            orderExpiryScheduler.scheduleDefault(order.getId());
            return;
        }

        Duration ttl = Duration.between(LocalDateTime.now(), expiredAt);
        orderExpiryScheduler.schedule(order.getId(), ttl);
    }

    private OrderPaidEvent toOrderPaidEvent(Order order) {
        List<OrderPaidEvent.OrderPaidItem> paidItems = order.getItems().stream()
                .map(item -> OrderPaidEvent.OrderPaidItem.builder()
                        .ticketTypeId(item.getTicketTypeId())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .build())
                .toList();

        return OrderPaidEvent.builder()
                .orderId(order.getId())
                .userId(order.getUserId())
                .paidAt(LocalDateTime.now())
                .items(paidItems)
                .build();
    }
}
