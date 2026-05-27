package fit.iuh.payment_service.dtos.requests;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentCallbackRequest {

    @NotBlank
    private String sourcePath;

    @NotBlank
    private String callbackUrl;

    private String provider;
    private Long paymentId;
    private String paymentReference;
    private String providerTransactionId;
    private String rawQueryString;
    private Map<String, String> queryParams;
}