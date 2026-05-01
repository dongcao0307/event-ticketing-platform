package fit.iuh.order_service.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderRequest {
    @NotNull(message = "userId must not be null")
    private Long userId;

    @NotBlank(message = "idempotenceKey must not be blank")
    @Size(max = 80, message = "idempotenceKey max length is 80")
    private String idempotenceKey;

    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;
}
