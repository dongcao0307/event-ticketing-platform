package fit.iuh.payment_service.providers.free.services.impl;

import fit.iuh.payment_service.dtos.responses.PaymentStatusResponse;
import fit.iuh.payment_service.entities.Payment;
import fit.iuh.payment_service.entities.PaymentMethod;
import fit.iuh.payment_service.entities.PaymentStatus;
import fit.iuh.payment_service.entities.ProcessorType;
import fit.iuh.payment_service.entities.Transaction;
import fit.iuh.payment_service.entities.TransactionStatus;
import fit.iuh.payment_service.exceptions.AppException;
import fit.iuh.payment_service.exceptions.ErrorCode;
import fit.iuh.payment_service.messaging.PaymentEventPublisher;
import fit.iuh.payment_service.messaging.PaymentStatusChangedEvent;
import fit.iuh.payment_service.providers.free.dtos.requests.FreeCreatePaymentRequest;
import fit.iuh.payment_service.providers.free.dtos.responses.FreeCreatePaymentResponse;
import fit.iuh.payment_service.providers.free.services.FreePaymentService;
import fit.iuh.payment_service.repositories.PaymentMethodRepository;
import fit.iuh.payment_service.repositories.PaymentRepository;
import fit.iuh.payment_service.repositories.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FreePaymentServiceImpl implements FreePaymentService {
    private static final String PROVIDER_NAME = "Free";

    private final PaymentRepository paymentRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final TransactionRepository transactionRepository;
    private final PaymentEventPublisher paymentEventPublisher;

    @Override
    @Transactional
    public FreeCreatePaymentResponse createPayment(FreeCreatePaymentRequest request) {
        validateRequest(request);

        PaymentMethod paymentMethod = paymentMethodRepository
                .findByIdAndProcessorTypeAndIsAvailableTrue(request.getPaymentMethodId(), ProcessorType.FreeProcessor)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_METHOD_NOT_AVAILABLE));

        String paymentToken = UUID.randomUUID().toString();
        BigDecimal amount = request.getAmount() == null ? BigDecimal.ZERO : request.getAmount();

        Payment payment = Payment.builder()
                .orderId(request.getOrderId())
                .eventId(request.getEventId())
                .eventPerformanceId(request.getEventPerformanceId())
                .amount(amount)
                .paymentToken(paymentToken)
                .feeAmount(BigDecimal.ZERO)
                .organizerAmount(amount)
                .status(PaymentStatus.COMPLETED)
                .paymentMethod(paymentMethod)
                .build();
        payment = paymentRepository.save(payment);

        Transaction transaction = Transaction.builder()
                .id(UUID.randomUUID().toString())
                .providerResponse("{\"phase\":\"FREE\",\"note\":\"No payment required\"}")
                .timestamp(LocalDateTime.now())
                .providerTransactionId(null)
                .status(TransactionStatus.SUCCESS)
                .payment(payment)
                .build();
        transactionRepository.save(transaction);

        paymentEventPublisher.publishPaymentStatusChanged(PaymentStatusChangedEvent.builder()
                .paymentId(payment.getId())
                .orderId(payment.getOrderId())
                .eventId(payment.getEventId())
                .status(payment.getStatus())
                .occurredAt(LocalDateTime.now())
                .build());

        return FreeCreatePaymentResponse.builder()
                .paymentId(payment.getId())
                .paymentToken(payment.getPaymentToken())
                .initTransactionId(transaction.getId())
                .providerName(PROVIDER_NAME)
                .status(payment.getStatus())
                .build();
    }

    @Override
    public PaymentStatusResponse getPaymentStatus(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));
        return PaymentStatusResponse.builder()
                .paymentId(payment.getId())
                .paymentToken(payment.getPaymentToken())
                .status(payment.getStatus())
                .build();
    }

    private void validateRequest(FreeCreatePaymentRequest request) {
        if (request.getAmount() == null || request.getAmount().signum() < 0) {
            throw new AppException(ErrorCode.INVALID_POST_REQUEST);
        }
    }
}
