package fit.iuh.payment_service.dtos.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefundResponse {
    private String refundRequestId;
    private String status;
    private Long orderId;
    private Long paymentId;
    private BigDecimal amount;
    private Integer retryCount;
    private String lastError;
    private LocalDateTime updatedAt;
}
