package fit.iuh.order_service.services;

import fit.iuh.order_service.dtos.requests.AddOrderItemRequest;
import fit.iuh.order_service.dtos.requests.CreateOrderRequest;
import fit.iuh.order_service.dtos.requests.UpdateOrderStatusRequest;
import fit.iuh.order_service.dtos.responses.OrderResponse;

public interface OrderService {
    OrderResponse createOrder(CreateOrderRequest request);
    OrderResponse addOrderItems(Long orderId, java.util.List<AddOrderItemRequest> requests);
    OrderResponse updateOrderStatus(Long orderId, UpdateOrderStatusRequest request);
    OrderResponse findById(Long orderId);
}
