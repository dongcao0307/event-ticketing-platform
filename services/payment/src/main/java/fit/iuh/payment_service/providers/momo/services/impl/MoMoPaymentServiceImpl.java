package fit.iuh.payment_service.providers.momo.services.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import fit.iuh.payment_service.providers.momo.config.MoMoProperties;
import fit.iuh.payment_service.providers.momo.config.MoMoSecretProperties;
import fit.iuh.payment_service.providers.momo.dtos.requests.MoMoCreatePaymentRequest;
import fit.iuh.payment_service.providers.momo.dtos.requests.MoMoIpnRequest;
import fit.iuh.payment_service.providers.momo.dtos.responses.MoMoCreatePaymentResponse;
import fit.iuh.payment_service.providers.momo.dtos.responses.MoMoIpnResponse;
import fit.iuh.payment_service.providers.momo.mappers.MoMoIpnMapper;
import fit.iuh.payment_service.providers.momo.mappers.MoMoPaymentMapper;
import fit.iuh.payment_service.providers.momo.mappers.MoMoTransactionMapper;
import fit.iuh.payment_service.providers.momo.services.MoMoPaymentService;
import fit.iuh.payment_service.repositories.PaymentMethodRepository;
import fit.iuh.payment_service.repositories.PaymentRepository;
import fit.iuh.payment_service.repositories.TransactionRepository;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class MoMoPaymentServiceImpl implements MoMoPaymentService {
    private static final Pattern ORDER_REF_PATTERN = Pattern.compile("^MOMO-PAY(\\d+)-.*$");

    private final PaymentRepository paymentRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final TransactionRepository transactionRepository;
    private final MoMoProperties moMoProperties;
    private final MoMoSecretProperties moMoSecretProperties;
    private final MoMoPaymentMapper moMoPaymentMapper;
    private final MoMoTransactionMapper moMoTransactionMapper;
    private final MoMoIpnMapper moMoIpnMapper;
    private final PaymentEventPublisher paymentEventPublisher;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    @Transactional
    public MoMoCreatePaymentResponse createPayment(MoMoCreatePaymentRequest request) {
        validateRequest(request);

        PaymentMethod paymentMethod = paymentMethodRepository
                .findByIdAndProcessorTypeAndIsAvailableTrue(request.getPaymentMethodId(), ProcessorType.MoMoProcessor)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_METHOD_NOT_AVAILABLE));

        BigDecimal feeRate = moMoProperties.getFeeRatePercent() == null
                ? BigDecimal.ZERO
                : moMoProperties.getFeeRatePercent();
        BigDecimal feeAmount = request.getAmount()
                .multiply(feeRate)
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        BigDecimal organizerAmount = request.getAmount().subtract(feeAmount);

        String paymentToken = UUID.randomUUID().toString();
        Payment payment = moMoPaymentMapper.toPayment(
                request, paymentMethod, paymentToken, feeAmount, organizerAmount, PaymentStatus.PENDING
        );
        payment = paymentRepository.save(payment);

        String orderRef = buildOrderRef(payment.getId());
        String requestId = UUID.randomUUID().toString();
        String amount = request.getAmount().setScale(0, RoundingMode.HALF_UP).toPlainString();
        String returnUrl = nv(request.getReturnUrl(), moMoProperties.getReturnUrl());
        String ipnUrl = nv(moMoProperties.getIpnUrl(), "http://localhost:8085/api/payment/momo/ipn");
        String orderInfo = nv(request.getOrderInfo(), "Thanh toan don hang " + orderRef);
        String requestType = nv(moMoProperties.getRequestType(), "captureWallet");
        String extraData = buildExtraData(payment);

        Map<String, Object> requestBody = buildCreateRequestBody(
                amount,
                requestId,
                orderRef,
                orderInfo,
                returnUrl,
                ipnUrl,
                requestType,
                extraData
        );

        Map<String, Object> createResult = callCreatePaymentApi(requestBody);
        int resultCode = parseInt(createResult.get("resultCode"), -1);
        String payUrl = firstNonBlank(asString(createResult.get("payUrl")), asString(createResult.get("deeplink")));
        if (resultCode != 0 || isBlank(payUrl)) {
            throw new AppException(ErrorCode.INVALID_POST_REQUEST);
        }

        Transaction initTransaction = moMoTransactionMapper.toTransaction(
                UUID.randomUUID().toString(),
                toJson(createResult),
                LocalDateTime.now(),
                null,
                TransactionStatus.INIT,
                payment
        );
        transactionRepository.save(initTransaction);

        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(resolveExpireMinutes());
        return moMoPaymentMapper.toCreatePaymentResponse(
                payment,
                initTransaction.getId(),
                moMoProperties.getProviderName(),
                requestId,
                orderRef,
                payUrl,
                expiresAt
        );
    }

    @Override
    @Transactional
    public MoMoIpnResponse handleIpn(MoMoIpnRequest request) {
        validateRequest(request);

        if (Boolean.TRUE.equals(moMoProperties.getSignatureRequired()) && !verifyIpnSignature(request)) {
            throw new AppException(ErrorCode.INVALID_SIGNATURE);
        }

        Long paymentId = extractPaymentIdFromOrderRef(request.getOrderId());
        if (paymentId == null) {
            throw new AppException(ErrorCode.INVALID_POST_REQUEST);
        }

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        String paymentTokenFromExtra = extractPaymentToken(request.getExtraData());
        if (!isBlank(paymentTokenFromExtra) && !paymentTokenFromExtra.equals(payment.getPaymentToken())) {
            throw new AppException(ErrorCode.INVALID_POST_REQUEST);
        }

        String providerTransactionId = firstNonBlank(request.getTransId(), request.getRequestId());
        if (!isBlank(providerTransactionId) && transactionRepository.existsByProviderTransactionId(providerTransactionId)) {
            throw new AppException(ErrorCode.DUPLICATE_PROVIDER_TRANSACTION_ID);
        }

        PaymentStatus nextStatus = request.getResultCode() != null && request.getResultCode() == 0
                ? PaymentStatus.COMPLETED
                : PaymentStatus.FAILED;

        payment.setStatus(nextStatus);
        paymentRepository.save(payment);

        String providerResponse = isBlank(request.getRawResponse()) ? toJson(request) : request.getRawResponse();
        Transaction callbackTransaction = moMoTransactionMapper.toTransaction(
                UUID.randomUUID().toString(),
                providerResponse,
                LocalDateTime.now(),
                providerTransactionId,
                nextStatus == PaymentStatus.COMPLETED ? TransactionStatus.SUCCESS : TransactionStatus.FAILED,
                payment
        );
        callbackTransaction = transactionRepository.save(callbackTransaction);

        paymentEventPublisher.publishPaymentStatusChanged(moMoPaymentMapper.toPaymentStatusChangedEvent(payment, LocalDateTime.now()));
        return moMoPaymentMapper.toIpnResponse(payment, callbackTransaction, request.getResultCode(), request.getMessage());
    }

    @Override
    public PaymentStatusResponse getPaymentStatus(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));
        return moMoPaymentMapper.toPaymentStatusResponse(payment);
    }

    private Map<String, Object> buildCreateRequestBody(String amount,
                                                       String requestId,
                                                       String orderRef,
                                                       String orderInfo,
                                                       String returnUrl,
                                                       String ipnUrl,
                                                       String requestType,
                                                       String extraData) {
        String signatureData = "accessKey=" + moMoSecretProperties.getAccessKey()
                + "&amount=" + amount
                + "&extraData=" + extraData
                + "&ipnUrl=" + ipnUrl
                + "&orderId=" + orderRef
                + "&orderInfo=" + orderInfo
                + "&partnerCode=" + moMoSecretProperties.getPartnerCode()
                + "&redirectUrl=" + returnUrl
                + "&requestId=" + requestId
                + "&requestType=" + requestType;

        String signature = hmacSha256Hex(signatureData, moMoSecretProperties.getSecretKey());

        Map<String, Object> requestBody = new LinkedHashMap<>();
        requestBody.put("partnerCode", moMoSecretProperties.getPartnerCode());
        requestBody.put("accessKey", moMoSecretProperties.getAccessKey());
        requestBody.put("requestId", requestId);
        requestBody.put("amount", amount);
        requestBody.put("orderId", orderRef);
        requestBody.put("orderInfo", orderInfo);
        requestBody.put("redirectUrl", returnUrl);
        requestBody.put("ipnUrl", ipnUrl);
        requestBody.put("requestType", requestType);
        requestBody.put("extraData", extraData);
        requestBody.put("lang", nv(moMoProperties.getLang(), "vi"));
        requestBody.put("autoCapture", moMoProperties.getAutoCapture() == null || moMoProperties.getAutoCapture());
        requestBody.put("signature", signature);
        return requestBody;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> callCreatePaymentApi(Map<String, Object> requestBody) {
        if (isBlank(moMoSecretProperties.getPartnerCode())
                || isBlank(moMoSecretProperties.getAccessKey())
                || isBlank(moMoSecretProperties.getSecretKey())
                || isBlank(moMoProperties.getCreateEndpoint())) {
            throw new AppException(ErrorCode.INVALID_POST_REQUEST);
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<Map> response = restTemplate.postForEntity(moMoProperties.getCreateEndpoint(), entity, Map.class);
            return response.getBody() == null ? Map.of() : response.getBody();
        } catch (Exception ex) {
            throw new AppException(ErrorCode.INVALID_POST_REQUEST);
        }
    }

    private boolean verifyIpnSignature(MoMoIpnRequest request) {
        String accessKey = moMoSecretProperties.getAccessKey();
        String secretKey = moMoSecretProperties.getSecretKey();
        if (isBlank(accessKey) || isBlank(secretKey)) {
            return false;
        }
        String payload = moMoIpnMapper.toSignatureData(moMoIpnMapper.toSignaturePayload(request, accessKey));
        String calculated = hmacSha256Hex(payload, secretKey);
        return calculated.equalsIgnoreCase(request.getSignature());
    }

    private String buildOrderRef(Long paymentId) {
        String randomPart = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        return "MOMO-PAY" + paymentId + "-" + randomPart;
    }

    private Long extractPaymentIdFromOrderRef(String orderRef) {
        if (isBlank(orderRef)) {
            return null;
        }
        Matcher matcher = ORDER_REF_PATTERN.matcher(orderRef);
        if (!matcher.matches()) {
            return null;
        }
        return Long.parseLong(matcher.group(1));
    }

    private String buildExtraData(Payment payment) {
        String raw = "paymentId=" + payment.getId() + "&paymentToken=" + payment.getPaymentToken();
        return Base64.getEncoder().encodeToString(raw.getBytes(StandardCharsets.UTF_8));
    }

    private String extractPaymentToken(String extraData) {
        if (isBlank(extraData)) {
            return null;
        }

        String decoded = extraData;
        try {
            decoded = new String(Base64.getDecoder().decode(extraData), StandardCharsets.UTF_8);
        } catch (IllegalArgumentException ignored) {
            decoded = extraData;
        }

        for (String pair : decoded.split("&")) {
            String[] parts = pair.split("=", 2);
            if (parts.length == 2 && "paymentToken".equals(parts[0])) {
                return parts[1];
            }
        }
        return null;
    }

    private String hmacSha256Hex(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            byte[] hashBytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return bytesToHex(hashBytes);
        } catch (Exception ex) {
            throw new AppException(ErrorCode.INVALID_SIGNATURE);
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder builder = new StringBuilder(bytes.length * 2);
        for (byte item : bytes) {
            builder.append(String.format("%02x", item));
        }
        return builder.toString();
    }

    private String toJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JsonProcessingException ex) {
            return String.valueOf(value);
        }
    }

    private String asString(Object value) {
        return value == null ? null : String.valueOf(value);
    }

    private int parseInt(Object value, int fallback) {
        if (value == null) {
            return fallback;
        }
        try {
            return Integer.parseInt(String.valueOf(value));
        } catch (NumberFormatException ex) {
            return fallback;
        }
    }

    private String nv(String value, String fallback) {
        return isBlank(value) ? fallback : value;
    }

    private String firstNonBlank(String first, String second) {
        return isBlank(first) ? second : first;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private int resolveExpireMinutes() {
        Integer value = moMoProperties.getExpireMinutes();
        return value == null || value <= 0 ? 15 : value;
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
