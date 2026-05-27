package fit.iuh.payment_service.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentCallbackResponse {
    private Long id;
    private String provider;
    private Long paymentId;
    private String paymentReference;
    private String providerTransactionId;
    private String sourcePath;
    private LocalDateTime receivedAt;
}