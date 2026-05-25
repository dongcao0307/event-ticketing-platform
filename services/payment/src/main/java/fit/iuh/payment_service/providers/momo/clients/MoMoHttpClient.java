package fit.iuh.payment_service.providers.momo.clients;

import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class MoMoHttpClient {
    private final RestTemplate restTemplate = new RestTemplate();

    @Retry(name = "paymentProviderRetry")
    @CircuitBreaker(name = "paymentProviderCircuitBreaker", fallbackMethod = "createPaymentFallback")
    public Map<String, Object> createPayment(Map<String, Object> requestBody, String endpoint) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(endpoint, entity, Map.class);
        return response.getBody() == null ? Map.of() : response.getBody();
    }

    protected Map<String, Object> createPaymentFallback(Map<String, Object> requestBody, String endpoint, Throwable throwable) {
        return Map.of();
    }
}
