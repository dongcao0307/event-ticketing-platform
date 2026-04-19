package fit.iuh.payment_service.providers.vnpay.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
public class VnPayCreatePaymentRequest {
    @NotNull
    private Long orderId;

    @NotNull
    private Long eventId;

    @NotNull
    private Long eventPerformanceId;

    @NotNull
    @Positive
    private BigDecimal amount;

    @NotBlank
    private String paymentMethodId;

    private String returnUrl;
    private String clientIp;
}
