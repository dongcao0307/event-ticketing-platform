package fit.iuh.order_service.dtos.requests;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddOrderItemRequest {
    @NotNull(message = "ticketTypeId must not be null")
    private Long ticketTypeId;

    @NotNull(message = "quantity must not be null")
    @Min(value = 1, message = "quantity must be >= 1")
    private Integer quantity;

    @NotNull(message = "unitPrice must not be null")
    private BigDecimal unitPrice;
}
