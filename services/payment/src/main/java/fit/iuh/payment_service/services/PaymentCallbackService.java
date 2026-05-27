package fit.iuh.payment_service.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import fit.iuh.payment_service.dtos.requests.PaymentCallbackRequest;
import fit.iuh.payment_service.dtos.responses.PaymentCallbackResponse;
import fit.iuh.payment_service.entities.PaymentCallbackLog;
import fit.iuh.payment_service.exceptions.AppException;
import fit.iuh.payment_service.exceptions.ErrorCode;
import fit.iuh.payment_service.repositories.PaymentCallbackLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class PaymentCallbackService {
    private static final Pattern PAYMENT_ID_PATTERN = Pattern.compile("(\\d+)");
    private static final Pattern VNPAY_TXNREF_PATTERN = Pattern.compile("^VNPAY-PAY(\\d+)-.*$");
    private static final Pattern MOMO_ORDERREF_PATTERN = Pattern.compile("^MOMO-PAY(\\d+)-.*$");

    private final PaymentCallbackLogRepository paymentCallbackLogRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public PaymentCallbackResponse saveCallback(PaymentCallbackRequest request) {
        if (request == null || request.getQueryParams() == null || request.getQueryParams().isEmpty()) {
            throw new AppException(ErrorCode.INVALID_POST_REQUEST);
        }

        String provider = resolveProvider(request.getProvider(), request.getQueryParams());
        String queryString = request.getRawQueryString();
        if (queryString == null || queryString.isBlank()) {
            queryString = buildQueryString(request.getQueryParams());
        }

        String paymentReference = resolvePaymentReference(request, provider);
        Long paymentId = request.getPaymentId() != null ? request.getPaymentId() : extractPaymentId(paymentReference);
        String providerTransactionId = resolveProviderTransactionId(request, provider);

        PaymentCallbackLog logEntry = PaymentCallbackLog.builder()
                .provider(provider)
                .paymentId(paymentId)
                .paymentReference(paymentReference)
                .providerTransactionId(providerTransactionId)
                .sourcePath(request.getSourcePath())
                .callbackUrl(request.getCallbackUrl())
                .rawQueryString(queryString)
                .rawPayload(toJson(request.getQueryParams()))
                .receivedAt(LocalDateTime.now())
                .build();

        PaymentCallbackLog saved = paymentCallbackLogRepository.save(logEntry);
        return PaymentCallbackResponse.builder()
                .id(saved.getId())
                .provider(saved.getProvider())
                .paymentId(saved.getPaymentId())
                .paymentReference(saved.getPaymentReference())
                .providerTransactionId(saved.getProviderTransactionId())
                .sourcePath(saved.getSourcePath())
                .receivedAt(saved.getReceivedAt())
                .build();
    }

    private String resolveProvider(String explicitProvider, Map<String, String> queryParams) {
        if (explicitProvider != null && !explicitProvider.isBlank()) {
            return explicitProvider.trim().toUpperCase();
        }
        if (queryParams.keySet().stream().anyMatch(key -> key.startsWith("vnp_"))) {
            return "VNPAY";
        }
        if (queryParams.containsKey("partnerCode") || queryParams.containsKey("resultCode")) {
            return "MOMO";
        }
        return "UNKNOWN";
    }

    private String resolvePaymentReference(PaymentCallbackRequest request, String provider) {
        if (request.getPaymentReference() != null && !request.getPaymentReference().isBlank()) {
            return request.getPaymentReference().trim();
        }
        if ("VNPAY".equals(provider)) {
            return request.getQueryParams().getOrDefault("vnp_TxnRef", null);
        }
        if ("MOMO".equals(provider)) {
            return request.getQueryParams().getOrDefault("orderId", null);
        }
        return request.getQueryParams().getOrDefault("orderId", request.getQueryParams().getOrDefault("vnp_TxnRef", null));
    }

    private String resolveProviderTransactionId(PaymentCallbackRequest request, String provider) {
        if (request.getProviderTransactionId() != null && !request.getProviderTransactionId().isBlank()) {
            return request.getProviderTransactionId().trim();
        }
        if ("VNPAY".equals(provider)) {
            return request.getQueryParams().getOrDefault("vnp_TransactionNo", null);
        }
        if ("MOMO".equals(provider)) {
            return request.getQueryParams().getOrDefault("transId", null);
        }
        return null;
    }

    private Long extractPaymentId(String paymentReference) {
        if (paymentReference == null || paymentReference.isBlank()) {
            return null;
        }

        // Try provider-specific well-known formats first (generated by our services)
        Matcher vnMatcher = VNPAY_TXNREF_PATTERN.matcher(paymentReference);
        if (vnMatcher.matches()) {
            try {
                return Long.parseLong(vnMatcher.group(1));
            } catch (NumberFormatException ignored) {
                return null;
            }
        }

        Matcher moMatcher = MOMO_ORDERREF_PATTERN.matcher(paymentReference);
        if (moMatcher.matches()) {
            try {
                return Long.parseLong(moMatcher.group(1));
            } catch (NumberFormatException ignored) {
                return null;
            }
        }

        // Fallback: pick the longest numeric fragment (more likely to be an id than a short suffix)
        Matcher matcher = PAYMENT_ID_PATTERN.matcher(paymentReference);
        String longest = null;
        while (matcher.find()) {
            String num = matcher.group(1);
            if (longest == null || num.length() > longest.length()) {
                longest = num;
            }
        }
        if (longest != null) {
            try {
                return Long.parseLong(longest);
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
        return null;
    }

    private String buildQueryString(Map<String, String> queryParams) {
        return queryParams.entrySet().stream()
                .map(entry -> entry.getKey() + "=" + entry.getValue())
                .reduce((left, right) -> left + "&" + right)
                .orElse("");
    }

    private String toJson(Map<String, String> value) {
        Map<String, String> ordered = new LinkedHashMap<>(value);
        try {
            return objectMapper.writeValueAsString(ordered);
        } catch (JsonProcessingException ex) {
            return String.valueOf(ordered);
        }
    }
}