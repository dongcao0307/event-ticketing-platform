package fit.iuh.payment_service.services;

import fit.iuh.payment_service.dtos.requests.RefundCreateRequest;
import fit.iuh.payment_service.dtos.responses.RefundResponse;
import fit.iuh.payment_service.entities.Payment;
import fit.iuh.payment_service.entities.RefundRequest;
import fit.iuh.payment_service.entities.RefundStatus;
import fit.iuh.payment_service.repositories.PaymentRepository;
import fit.iuh.payment_service.repositories.RefundRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefundService {
    private final RefundRequestRepository refundRequestRepository;
    private final PaymentRepository paymentRepository;

    public RefundResponse createRefund(RefundCreateRequest request) {
        // Idempotency check
        if (request.getIdempotencyKey() != null) {
            Optional<RefundRequest> existing = refundRequestRepository.findFirstByIdempotencyKey(request.getIdempotencyKey());
            if (existing.isPresent()) {
                RefundRequest r = existing.get();
                return RefundResponse.builder().refundRequestId(r.getId()).status(r.getStatus().name()).build();
            }
        }

            Payment payment = paymentRepository.findByOrderId(request.getOrderId())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Khong tim thay payment theo orderId=" + request.getOrderId()
                ));

            BigDecimal amount = payment.getAmount();

        String id = UUID.randomUUID().toString();
        RefundRequest entity = RefundRequest.builder()
                .id(id)
                .orderId(request.getOrderId())
                .paymentId(payment.getId())
            .amount(amount)
                .reason(request.getReason())
                .idempotencyKey(request.getIdempotencyKey())
                .status(RefundStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        refundRequestRepository.save(entity);

        return RefundResponse.builder().refundRequestId(id).status(entity.getStatus().name()).build();
    }
}
