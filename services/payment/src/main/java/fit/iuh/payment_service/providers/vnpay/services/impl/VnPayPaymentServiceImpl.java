package fit.iuh.payment_service.providers.vnpay.services.impl;

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
import fit.iuh.payment_service.providers.vnpay.config.VnPayProperties;
import fit.iuh.payment_service.providers.vnpay.config.VnPaySecretProperties;
import fit.iuh.payment_service.providers.vnpay.dtos.requests.VnPayCreatePaymentRequest;
import fit.iuh.payment_service.providers.vnpay.dtos.requests.VnPayIpnRequest;
import fit.iuh.payment_service.providers.vnpay.dtos.responses.VnPayCreatePaymentResponse;
import fit.iuh.payment_service.providers.vnpay.dtos.responses.VnPayGatewayIpnResponse;
import fit.iuh.payment_service.providers.vnpay.dtos.responses.VnPayIpnResponse;
import fit.iuh.payment_service.providers.vnpay.mappers.VnPayIpnMapper;
import fit.iuh.payment_service.providers.vnpay.mappers.VnPayPaymentMapper;
import fit.iuh.payment_service.providers.vnpay.mappers.VnPayTransactionMapper;
import fit.iuh.payment_service.providers.vnpay.services.VnPayPaymentService;
import fit.iuh.payment_service.repositories.PaymentMethodRepository;
import fit.iuh.payment_service.repositories.PaymentRepository;
import fit.iuh.payment_service.repositories.TransactionRepository;
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
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class VnPayPaymentServiceImpl implements VnPayPaymentService {
    private final PaymentRepository paymentRepository;
    private final PaymentMethodRepository paymentMethodRepository;
    private final TransactionRepository transactionRepository;
    private final VnPayProperties vnPayProperties;
    private final VnPaySecretProperties vnPaySecretProperties;
    private final VnPayPaymentMapper vnPayPaymentMapper;
    private final VnPayTransactionMapper vnPayTransactionMapper;
    private final VnPayIpnMapper vnPayIpnMapper;
    private final PaymentEventPublisher paymentEventPublisher;

    @Override
    @Transactional
    public VnPayCreatePaymentResponse createPayment(VnPayCreatePaymentRequest request) {
        validateRequest(request);

        PaymentMethod paymentMethod = paymentMethodRepository
                .findByIdAndProcessorTypeAndIsAvailableTrue(request.getPaymentMethodId(), ProcessorType.VNPayProcessor)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_METHOD_NOT_AVAILABLE));

        BigDecimal feeRate = vnPayProperties.getFeeRatePercent() == null
                ? BigDecimal.ZERO
                : vnPayProperties.getFeeRatePercent();
        BigDecimal feeAmount = request.getAmount()
                .multiply(feeRate)
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);
        BigDecimal organizerAmount = request.getAmount().subtract(feeAmount);

        String paymentToken = UUID.randomUUID().toString();
        Payment payment = vnPayPaymentMapper.toPayment(
                request, paymentMethod, paymentToken, feeAmount, organizerAmount, PaymentStatus.PENDING
        );
        payment = paymentRepository.save(payment);

        String txnRef = buildTxnRef(payment.getId());
        String paymentUrl = buildSandboxPaymentUrl(txnRef, request);

        Transaction initTransaction = vnPayTransactionMapper.toTransaction(
                UUID.randomUUID().toString(),
                "{\"phase\":\"INIT\",\"sandbox\":true,\"paymentUrl\":\"" + paymentUrl + "\",\"txnRef\":\"" + txnRef + "\"}",
                LocalDateTime.now(),
                null,
                TransactionStatus.INIT,
                payment
        );
        transactionRepository.save(initTransaction);

        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(resolveExpireMinutes());
        return vnPayPaymentMapper.toCreatePaymentResponse(
                payment,
                initTransaction.getId(),
                vnPayProperties.getProviderName(),
                txnRef,
                paymentUrl,
                expiresAt
        );
    }

    @Override
    @Transactional
    public VnPayIpnResponse handleIpn(VnPayIpnRequest request) {
        validateRequest(request);

        Payment payment = paymentRepository.findById(request.getPaymentId())
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));

        if (!request.getPaymentToken().equals(payment.getPaymentToken())) {
            throw new AppException(ErrorCode.INVALID_POST_REQUEST);
        }

        if (!verifyIpnSignature(request)) {
            throw new AppException(ErrorCode.INVALID_SIGNATURE);
        }

        if (transactionRepository.existsByProviderTransactionId(request.getTransactionNo())) {
            throw new AppException(ErrorCode.DUPLICATE_PROVIDER_TRANSACTION_ID);
        }

        PaymentStatus nextStatus = "00".equals(request.getResponseCode()) ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;
        payment.setStatus(nextStatus);
        paymentRepository.save(payment);

        Transaction callbackTransaction = vnPayTransactionMapper.toTransaction(
                UUID.randomUUID().toString(),
                request.getRawResponse(),
                LocalDateTime.now(),
                request.getTransactionNo(),
                nextStatus == PaymentStatus.COMPLETED ? TransactionStatus.SUCCESS : TransactionStatus.FAILED,
                payment
        );
        callbackTransaction = transactionRepository.save(callbackTransaction);

        paymentEventPublisher.publishPaymentStatusChanged(vnPayPaymentMapper.toPaymentStatusChangedEvent(payment, LocalDateTime.now()));
        return vnPayPaymentMapper.toIpnResponse(payment, callbackTransaction);
    }

    @Override
    @Transactional
    public VnPayGatewayIpnResponse handleGatewayIpn(Map<String, String> queryParams) {
        try {
            String secureHash = queryParams.get("vnp_SecureHash");
            String txnRef = queryParams.get("vnp_TxnRef");
            String transactionNo = queryParams.get("vnp_TransactionNo");
            String responseCode = queryParams.get("vnp_ResponseCode");
            String amount = queryParams.get("vnp_Amount");

            if (isBlank(secureHash) || isBlank(txnRef) || isBlank(transactionNo) || isBlank(responseCode) || isBlank(amount)) {
                return gatewayResponse("99", "Invalid request");
            }

            if (!verifyGatewaySignature(queryParams)) {
                return gatewayResponse("97", "Invalid signature");
            }

            Long paymentId = extractPaymentIdFromTxnRef(txnRef);
            if (paymentId == null) {
                return gatewayResponse("01", "Order not found");
            }

            Payment payment = paymentRepository.findById(paymentId).orElse(null);
            if (payment == null) {
                return gatewayResponse("01", "Order not found");
            }

            if (transactionRepository.existsByProviderTransactionId(transactionNo)) {
                return gatewayResponse("00", "Confirm Success");
            }

            PaymentStatus nextStatus = "00".equals(responseCode) ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;
            payment.setStatus(nextStatus);
            paymentRepository.save(payment);

            String providerResponse = queryParams.toString();
            Transaction callbackTransaction = vnPayTransactionMapper.toTransaction(
                    UUID.randomUUID().toString(),
                    providerResponse,
                    LocalDateTime.now(),
                    transactionNo,
                    nextStatus == PaymentStatus.COMPLETED ? TransactionStatus.SUCCESS : TransactionStatus.FAILED,
                    payment
            );
            transactionRepository.save(callbackTransaction);
            paymentEventPublisher.publishPaymentStatusChanged(vnPayPaymentMapper.toPaymentStatusChangedEvent(payment, LocalDateTime.now()));

            return gatewayResponse("00", "Confirm Success");
        } catch (Exception ex) {
            return gatewayResponse("99", "Unknown error");
        }
    }

    @Override
    public PaymentStatusResponse getPaymentStatus(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_NOT_FOUND));
        return vnPayPaymentMapper.toPaymentStatusResponse(payment);
    }

    private String buildSandboxPaymentUrl(String txnRef, VnPayCreatePaymentRequest request) {
        String payUrl = vnPayProperties.getPayUrl();
        String returnUrl = request.getReturnUrl() == null || request.getReturnUrl().isBlank()
                ? vnPayProperties.getReturnUrl()
                : request.getReturnUrl();
        String amount = request.getAmount().multiply(new BigDecimal("100")).setScale(0, RoundingMode.HALF_UP).toPlainString();
        LocalDateTime now = LocalDateTime.now();
        String createDate = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String expireDate = now.plusMinutes(resolveExpireMinutes()).format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));

        Map<String, String> params = new TreeMap<>();
        params.put("vnp_Version", nv(vnPayProperties.getVersion(), "2.1.0"));
        params.put("vnp_Command", nv(vnPayProperties.getCommand(), "pay"));
        params.put("vnp_TmnCode", vnPaySecretProperties.getTmnCode());
        params.put("vnp_Amount", amount);
        params.put("vnp_CurrCode", nv(vnPayProperties.getCurrCode(), "VND"));
        params.put("vnp_TxnRef", txnRef);
        params.put("vnp_OrderInfo", "Payment" + txnRef);
        params.put("vnp_OrderType", "other");
        params.put("vnp_Locale", nv(vnPayProperties.getLocale(), "vn"));
        params.put("vnp_ReturnUrl", returnUrl);
        params.put("vnp_IpAddr", nv(request.getClientIp(), "127.0.0.1"));
        params.put("vnp_CreateDate", createDate);
        params.put("vnp_ExpireDate", expireDate);

        String hashData = buildHashData(params);
        String query = buildQueryString(params);
        String secureHash = hmacSha512Hex(hashData, vnPaySecretProperties.getHashSecret());

        return payUrl + "?" + query
            + "&vnp_SecureHashType=HmacSHA512"
            + "&vnp_SecureHash=" + secureHash;
    }

    private String buildTxnRef(Long paymentId) {
        String randomPart = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
        return "PAY" + paymentId + randomPart;
    }

    private Long extractPaymentIdFromTxnRef(String txnRef) {
        Matcher matcher = Pattern.compile("^PAY(\\d+).*$").matcher(txnRef);
        if (!matcher.matches()) {
            return null;
        }
        return Long.parseLong(matcher.group(1));
    }

    private String buildHashData(Map<String, String> params) {
        List<String> pairs = new ArrayList<>();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            String value = entry.getValue();
            if (value == null || value.isBlank()) {
                continue;
            }
            pairs.add(entry.getKey() + "=" + urlEncodeAscii(value));
        }
        return String.join("&", pairs);
    }

    private String buildQueryString(Map<String, String> params) {
        List<String> pairs = new ArrayList<>();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            String value = entry.getValue();
            if (value == null || value.isBlank()) {
                continue;
            }
            pairs.add(urlEncodeAscii(entry.getKey()) + "=" + urlEncodeAscii(value));
        }
        return String.join("&", pairs);
    }

    private String nv(String value, String fallback) {
        return (value == null || value.isBlank()) ? fallback : value;
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private int resolveExpireMinutes() {
        Integer value = vnPayProperties.getExpireMinutes();
        return value == null || value <= 0 ? 15 : value;
    }

    private boolean verifyIpnSignature(VnPayIpnRequest request) {
        String secret = vnPaySecretProperties.getHashSecret();
        if (secret == null || secret.isBlank()) {
            return false;
        }
        String payload = vnPayIpnMapper.toSignatureData(vnPayIpnMapper.toSignaturePayload(request));
        String calculated = hmacSha512Hex(payload, secret);
        return calculated.equalsIgnoreCase(request.getSecureHash());
    }

    private boolean verifyGatewaySignature(Map<String, String> queryParams) {
        String secret = vnPaySecretProperties.getHashSecret();
        if (secret == null || secret.isBlank()) {
            return false;
        }

        String providedHash = queryParams.get("vnp_SecureHash");
        Map<String, String> filtered = new TreeMap<>();
        for (Map.Entry<String, String> entry : queryParams.entrySet()) {
            String key = entry.getKey();
            if ("vnp_SecureHash".equals(key) || "vnp_SecureHashType".equals(key)) {
                continue;
            }
            filtered.put(key, entry.getValue());
        }

        String hashData = buildHashData(filtered);
        String calculated = hmacSha512Hex(hashData, secret);
        return calculated.equalsIgnoreCase(providedHash);
    }

    private VnPayGatewayIpnResponse gatewayResponse(String rspCode, String message) {
        return VnPayGatewayIpnResponse.builder()
                .rspCode(rspCode)
                .message(message)
                .build();
    }

    private String hmacSha512Hex(String data, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKeySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            mac.init(secretKeySpec);
            return HexFormat.of().formatHex(mac.doFinal(data.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new AppException(ErrorCode.INVALID_SIGNATURE);
        }
    }

    private String urlEncode(String value) {
        return java.net.URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private String urlEncodeAscii(String value) {
        return java.net.URLEncoder.encode(value, StandardCharsets.US_ASCII);
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
