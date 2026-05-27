package fit.iuh.payment_service.services;

import fit.iuh.payment_service.dtos.requests.RefundCreateRequest;
import fit.iuh.payment_service.dtos.responses.RefundResponse;
import fit.iuh.payment_service.entities.Payment;
import fit.iuh.payment_service.entities.RefundRequest;
import fit.iuh.payment_service.entities.RefundStatus;
import fit.iuh.payment_service.repositories.PaymentRepository;
import fit.iuh.payment_service.repositories.RefundRequestRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefundService {
    private final RefundRequestRepository refundRequestRepository;
    private final PaymentRepository paymentRepository;

    private static final List<RefundStatus> ACTIVE_OR_FINISHED_STATUSES = List.of(
            RefundStatus.PENDING,
            RefundStatus.PROCESSING,
            RefundStatus.BOOKING_SYNC_PENDING,
            RefundStatus.COMPLETED
    );

    public RefundResponse createRefund(RefundCreateRequest request) {
        // Idempotency check
        if (request.getIdempotencyKey() != null) {
            Optional<RefundRequest> existing = refundRequestRepository.findFirstByIdempotencyKey(request.getIdempotencyKey());
            if (existing.isPresent()) {
                RefundRequest r = existing.get();
                return toResponse(r);
            }
        }

        // Prevent duplicate refund lifecycle per order while active/already completed
        Optional<RefundRequest> existingByOrder = refundRequestRepository
                .findFirstByOrderIdAndStatusInOrderByCreatedAtDesc(request.getOrderId(), ACTIVE_OR_FINISHED_STATUSES);
        if (existingByOrder.isPresent()) {
            RefundRequest r = existingByOrder.get();
            log.info("Skip duplicate refund create for orderId={} because request {} is already in status {}",
                    request.getOrderId(), r.getId(), r.getStatus());
            return toResponse(r);
        }

        Payment payment = paymentRepository.findByOrderId(request.getOrderId())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Khong tim thay payment theo orderId=" + request.getOrderId()
                ));

        BigDecimal amount = payment.getAmount();

        String id = UUID.randomUUID().toString();
        LocalDateTime now = LocalDateTime.now();
        RefundRequest entity = RefundRequest.builder()
                .id(id)
                .orderId(request.getOrderId())
                .paymentId(payment.getId())
                .amount(amount)
                .reason(request.getReason())
                .idempotencyKey(request.getIdempotencyKey())
                .status(RefundStatus.PENDING)
                .createdAt(now)
                .updatedAt(now)
                .retryCount(0)
                .build();

        refundRequestRepository.save(entity);
        log.info("Created refund request {} for orderId={} (paymentId={})", id, request.getOrderId(), payment.getId());

        return toResponse(entity);
    }

    public RefundResponse getRefundById(String refundRequestId) {
        RefundRequest refundRequest = refundRequestRepository.findById(refundRequestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Refund request not found"));

        return toResponse(refundRequest);
    }

    private RefundResponse toResponse(RefundRequest request) {
        return RefundResponse.builder()
                .refundRequestId(request.getId())
                .status(request.getStatus().name())
                .orderId(request.getOrderId())
                .paymentId(request.getPaymentId())
                .amount(request.getAmount())
                .retryCount(request.getRetryCount())
                .lastError(request.getLastError())
                .updatedAt(request.getUpdatedAt())
                .build();
    }
}
