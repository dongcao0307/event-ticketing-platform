package fit.iuh.order_service.controllers;

import fit.iuh.order_service.dtos.ApiResponse;
import fit.iuh.order_service.dtos.requests.AddOrderItemRequest;
import fit.iuh.order_service.dtos.requests.CreateOrderRequest;
import fit.iuh.order_service.dtos.requests.UpdateOrderStatusRequest;
import fit.iuh.order_service.dtos.responses.OrderResponse;
import fit.iuh.order_service.services.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ApiResponse<OrderResponse> createOrder(@RequestBody CreateOrderRequest request) {
        return ApiResponse.<OrderResponse>builder()
                .body(orderService.createOrder(request))
                .build();
    }

    @PostMapping("/{orderId}/items")
    public ApiResponse<OrderResponse> addOrderItems(@PathVariable Long orderId, @RequestBody List<AddOrderItemRequest> requests) {
        return ApiResponse.<OrderResponse>builder()
                .body(orderService.addOrderItems(orderId, requests))
                .build();
    }

    @PutMapping("/{orderId}/status")
    public ApiResponse<OrderResponse> updateStatus(@PathVariable Long orderId, @RequestBody UpdateOrderStatusRequest request) {
        return ApiResponse.<OrderResponse>builder()
                .body(orderService.updateOrderStatus(orderId, request))
                .build();
    }

    @GetMapping("/{orderId}")
    public ApiResponse<OrderResponse> getOrder(@PathVariable Long orderId) {
        return ApiResponse.<OrderResponse>builder()
                .body(orderService.findById(orderId))
                .build();
    }
}
