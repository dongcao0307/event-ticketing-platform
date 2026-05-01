package fit.iuh.order_service.mappers;

import fit.iuh.order_service.dtos.responses.OrderItemResponse;
import fit.iuh.order_service.entities.OrderItem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {
    OrderItemResponse toOrderItemResponse(OrderItem orderItem);
}
