package fit.iuh.payment_service.providers.vietqr.services.impl;

import fit.iuh.payment_service.entities.Payment;
import fit.iuh.payment_service.entities.PaymentMethod;
import fit.iuh.payment_service.entities.PaymentStatus;
import fit.iuh.payment_service.entities.ProcessorType;
import fit.iuh.payment_service.entities.Transaction;
import fit.iuh.payment_service.entities.TransactionStatus;
import fit.iuh.payment_service.exceptions.AppException;
import fit.iuh.payment_service.exceptions.ErrorCode;
import fit.iuh.payment_service.messaging.PaymentEventPublisher;
import fit.iuh.payment_service.providers.vietqr.config.VietQrProperties;
import fit.iuh.payment_service.providers.vietqr.config.VietQrSecretProperties;
import fit.iuh.payment_service.providers.vietqr.dtos.requests.VietQrCreatePaymentRequest;
import fit.iuh.payment_service.providers.vietqr.dtos.requests.VietQrWebhookRequest;
import fit.iuh.payment_service.providers.vietqr.dtos.responses.VietQrCreatePaymentResponse;
import fit.iuh.payment_service.providers.vietqr.dtos.responses.VietQrWebhookResponse;
import fit.iuh.payment_service.providers.vietqr.mappers.VietQrPaymentMapper;
import fit.iuh.payment_service.providers.vietqr.mappers.VietQrTransactionMapper;
import fit.iuh.payment_service.providers.vietqr.mappers.VietQrWebhookMapper;
import fit.iuh.payment_service.providers.vietqr.services.VietQrPaymentService;
import fit.iuh.payment_service.repositories.PaymentMethodRepository;
import fit.iuh.payment_service.repositories.PaymentRepository;
import fit.iuh.payment_service.repositories.TransactionRepository;
import fit.iuh.payment_service.dtos.responses.PaymentStatusResponse;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VietQrPaymentServiceImpl implements VietQrPaymentService {
    private final PaymentRepository paymentRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final TransactionRepository transactionRepository;
    private final VietQrProperties vietQrProperties;
    private final VietQrSecretProperties vietQrSecretProperties;
    private final VietQrPaymentMapper vietQrPaymentMapper;
    private final VietQrTransactionMapper vietQrTransactionMapper;
    private final VietQrWebhookMapper vietQrWebhookMapper;
    private final PaymentEventPublisher paymentEventPublisher;

    @Override
    @Transactional
    public VietQrCreatePaymentResponse createPayment(VietQrCreatePaymentRequest request) {
        validateRequest(request);

        PaymentMethod paymentMethod = paymentMethodRepository
                .findByIdAndProcessorTypeAndIsAvailableTrue(request.getPaymentMethodId(), ProcessorType.VietQRProcessor)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_METHOD_NOT_AVAILABLE));

        BigDecimal feeRate = vietQrProperties.getFeeRatePercent() == null
                ? BigDecimal.ZERO
                : vietQrProperties.getFeeRatePercent();
        BigDecimal feeAmount = request.getAmount()
                .multiply(feeRate)
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        BigDecimal organizerAmount = request.getAmount().subtract(feeAmount);

        String paymentToken = UUID.randomUUID().toString();
        Payment payment = vietQrPaymentMapper.toPayment(
                request, paymentMethod, paymentToken, feeAmount, organizerAmount, PaymentStatus.PENDING
        );
        payment = paymentRepository.save(payment);

        String transferContent = "PAY" + payment.getId();
        String qrCodeUrl = buildSandboxQrCodeUrl(paymentMethod.getConfigParams(), transferContent, request.getAmount());

        Transaction initTransaction = vietQrTransactionMapper.toTransaction(
                UUID.randomUUID().toString(),
                "{\"phase\":\"INIT\",\"sandbox\":true,\"qrCodeUrl\":\"" + qrCodeUrl + "\"}",
                LocalDateTime.now(),
                null,
                TransactionStatus.INIT,
                payment
        );
        transactionRepository.save(initTransaction);

        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(resolveQrExpireMinutes());
        return vietQrPaymentMapper.toCreatePaymentResponse(
                payment,
                initTransaction.getId(),
                vietQrProperties.getProviderName(),
                qrCodeUrl,
                transferContent,
                expiresAt
        );
    }

    @Override
    @Transactional
    public VietQrWebhookResponse handleWebhook(VietQrWebhookRequest request) {
        validateRequest(request);

        Payment payment = paymentRepository.findById(request.getPaymentId())
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        if (!request.getPaymentToken().equals(payment.getPaymentToken())) {
            throw new AppException(ErrorCode.INVALID_POST_REQUEST);
        }

        if (Boolean.TRUE.equals(vietQrProperties.getSignatureRequired()) && !verifySignature(request)) {
            throw new AppException(ErrorCode.INVALID_SIGNATURE);
        }

        if (transactionRepository.existsByProviderTransactionId(request.getProviderTransactionId())) {
            throw new AppException(ErrorCode.DUPLICATE_PROVIDER_TRANSACTION_ID);
        }

        PaymentStatus nextStatus = mapWebhookStatus(request.getStatus());
        payment.setStatus(nextStatus);
        paymentRepository.save(payment);

        Transaction callbackTransaction = vietQrTransactionMapper.toTransaction(
                UUID.randomUUID().toString(),
                request.getProviderResponse(),
                LocalDateTime.now(),
                request.getProviderTransactionId(),
                nextStatus == PaymentStatus.COMPLETED ? TransactionStatus.SUCCESS : TransactionStatus.FAILED,
                payment
        );
        callbackTransaction = transactionRepository.save(callbackTransaction);

        paymentEventPublisher.publishPaymentStatusChanged(vietQrPaymentMapper.toPaymentStatusChangedEvent(payment, LocalDateTime.now()));
        return vietQrPaymentMapper.toWebhookResponse(payment, callbackTransaction);
    }

    @Override
    public PaymentStatusResponse getPaymentStatus(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));
        return vietQrPaymentMapper.toPaymentStatusResponse(payment);
    }

    private String buildSandboxQrCodeUrl(Map<String, String> configParams, String transferContent, BigDecimal amount) {
        String bankBin = getConfigValue(configParams, "bankBin", "970422");
        String accountNo = getConfigValue(configParams, "accountNo", "19036886660018");
        String accountName = getConfigValue(configParams, "accountName", "TICKET BOX SANDBOX");
        String acqId = encode(accountNo);
        String accountNameEncoded = encode(accountName);
        String contentEncoded = encode(transferContent);

        String baseUrl = vietQrProperties.getQrBaseUrl() == null
                ? "https://img.vietqr.io/image"
                : vietQrProperties.getQrBaseUrl();

        return baseUrl + "/" + bankBin + "-" + acqId + "-compact2.png"
                + "?amount=" + amount.stripTrailingZeros().toPlainString()
                + "&addInfo=" + contentEncoded
                + "&accountName=" + accountNameEncoded;
    }

    private String getConfigValue(Map<String, String> configParams, String key, String fallback) {
        if (configParams == null) {
            return fallback;
        }
        String value = configParams.get(key);
        return (value == null || value.isBlank()) ? fallback : value;
    }

    private int resolveQrExpireMinutes() {
        Integer value = vietQrProperties.getQrExpiredMinutes();
        return value == null || value <= 0 ? 15 : value;
    }

    private PaymentStatus mapWebhookStatus(String status) {
        if (status == null) {
            throw new AppException(ErrorCode.INVALID_PAYMENT_STATUS);
        }
        return switch (status.trim().toUpperCase()) {
            case "SUCCESS", "COMPLETED", "PAID" -> PaymentStatus.COMPLETED;
            case "FAILED", "CANCELED", "CANCELLED", "EXPIRED" -> PaymentStatus.FAILED;
            default -> throw new AppException(ErrorCode.INVALID_PAYMENT_STATUS);
        };
    }

    private boolean verifySignature(VietQrWebhookRequest request) {
        String secret = vietQrSecretProperties.getWebhookSecret();
        if (secret == null || secret.isBlank()) {
            return false;
        }
        String payload = vietQrWebhookMapper.toSignatureData(vietQrWebhookMapper.toSignaturePayload(request));
        String calculated = hmacSha256Base64(payload, secret);
        return calculated.equals(request.getSignature());
    }

    private String hmacSha256Base64(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            return Base64.getEncoder().encodeToString(mac.doFinal(data.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new AppException(ErrorCode.INVALID_SIGNATURE);
        }
    }

    private String encode(String value) {
        return java.net.URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private <T> void validateRequest(T request) {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        factory.close();
        Set<ConstraintViolation<T>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            throw new fit.iuh.payment_service.exceptions.PostException(violations);
        }
    }
}
