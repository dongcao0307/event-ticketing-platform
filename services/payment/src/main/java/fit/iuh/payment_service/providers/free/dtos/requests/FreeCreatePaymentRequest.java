package fit.iuh.payment_service.providers.free.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FreeCreatePaymentRequest {
    @NotNull
    private Long orderId;

    @NotNull
    private Long eventId;

    @NotNull
    private Long eventPerformanceId;

    @NotNull
    @PositiveOrZero
    private BigDecimal amount;

    @NotBlank
    private String paymentMethodId;
}
