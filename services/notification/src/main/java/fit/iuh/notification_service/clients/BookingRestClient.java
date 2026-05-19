package fit.iuh.notification_service.clients;

import fit.iuh.notification_service.clients.dto.ApiResponse;
import fit.iuh.notification_service.clients.dto.BookingResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Slf4j
@Service
public class BookingRestClient {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String baseUrl;

    public BookingRestClient(@Value("${booking.service.base-url:http://localhost:8083}") String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public Optional<Long> findUserIdByBookingId(Long bookingId) {
        if (bookingId == null) {
            return Optional.empty();
        }

        String url = baseUrl + "/api/bookings/" + bookingId;
        try {
            ResponseEntity<ApiResponse<BookingResponse>> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<>() {}
            );
            ApiResponse<BookingResponse> body = response.getBody();
            if (body == null || body.getBody() == null) {
                return Optional.empty();
            }
            return Optional.ofNullable(body.getBody().getUserId());
        } catch (Exception ex) {
            log.warn("Failed to fetch booking {} from booking-service", bookingId, ex);
            return Optional.empty();
        }
    }
}
