package fit.iuh.order_service.dtos.requests;

import fit.iuh.order_service.entities.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateOrderStatusRequest {
    @NotNull(message = "status must not be null")
    private OrderStatus status;
}
