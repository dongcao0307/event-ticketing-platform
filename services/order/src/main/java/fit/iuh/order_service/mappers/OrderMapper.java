package fit.iuh.order_service.mappers;

import fit.iuh.order_service.dtos.responses.OrderResponse;
import fit.iuh.order_service.entities.Order;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class})
public interface OrderMapper {
    OrderResponse toOrderResponse(Order order);
}
