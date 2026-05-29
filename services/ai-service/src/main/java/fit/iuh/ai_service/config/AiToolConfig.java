package fit.iuh.ai_service.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatusCode;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import fit.iuh.ai_service.dtos.EventSummary;
import fit.iuh.ai_service.dtos.SearchEventRequest;
import org.springframework.ai.model.function.FunctionCallback;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

/**
 * AiToolConfig registers all Spring AI function-calling tools into the
 * application context so they can be referenced by name inside ChatClient.
 *
 * <p><b>Architecture note:</b> {@code SemanticSearchService} resides in the
 * {@code event-service} microservice (port 8082). We call it over HTTP using
 * Spring's {@link RestClient}. No shared JARs or direct bean injection across
 * JVM boundaries.
 *
 * <p><b>Spring AI 1.0.0-M6 API:</b> Function tools are registered as
 * {@link FunctionCallback} beans via {@link FunctionCallback#builder}.
 */
@Configuration
public class AiToolConfig {

    @Value("${services.event.base-url:http://event-service:8082}")
    private String eventServiceBaseUrl;

    private final ObjectMapper objectMapper;

    public AiToolConfig(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * Registers the {@code searchEventTool} as a named {@link FunctionCallback}.
     * The bean name must match what {@code GroqChatService} passes to
     * {@code .defaultFunctions("searchEventTool")}.
     *
     * <p>We use an explicit {@code Function<SearchEventRequest, String>} class
     * (not a lambda) so Spring AI can reliably resolve the generic input type
     * via reflection when building the JSON schema for the LLM tool manifest.
     */
    @Bean
    public FunctionCallback searchEventTool() {
        // Explicit Function implementation — avoids type-erasure issues with lambdas
        Function<SearchEventRequest, String> fn = new EventSearchFunction(eventServiceBaseUrl, objectMapper);

        return FunctionCallback.builder()
                .function("searchEventTool", fn)
                .description(
                        "Searches the TicketBox event database for real, published events matching the user's query. " +
                        "ALWAYS call this tool when the user asks about events, concerts, shows, sports, festivals, workshops, ticket prices, or schedules. " +
                        "NEVER fabricate event data - only use what this tool returns. " +
                        "IMPORTANT: OMIT parameters that are not specified or cannot be inferred. DO NOT pass null or empty string values. " +
                        "Input parameters: " +
                        "- keyword: free-text search query (e.g. name of singer, band, show). Omit if not specified. " +
                        "- category: MUSIC/THEATER/SPORTS/WORKSHOP/FESTIVAL/COMEDY/EXHIBITION/OTHER. Omit if not specified. " +
                        "- city: Hồ Chí Minh, Hà Nội, Đà Nẵng, etc. Omit if not specified. " +
                        "- maxPrice: maximum price limit as a raw double value (e.g. if user says 'dưới 500k' set to 500000.0). Omit entirely if not specified. DO NOT pass null. " +
                        "- isFree: set to true if user specifically asks for free or zero-cost events. Omit entirely if not requested. DO NOT pass null. " +
                        "- startDate: start date of search window in ISO format YYYY-MM-DD. DO NOT guess or supply a start date unless the user explicitly requests events starting from/after a specific date or time range. Otherwise, omit this parameter. " +
                        "- endDate: end date of search window in ISO format YYYY-MM-DD. DO NOT guess or supply an end date unless the user explicitly requests events ending at/before a specific date or time range. Otherwise, omit this parameter. " +
                        "- location: location name or venue. Omit if not specified. " +
                        "- organizer: organizer name or company. Omit if not specified. " +
                        "Returns JSON array with id, title, city, location, startTime, priceDisplay, and bookingUrl for each event."
                )
                .inputType(SearchEventRequest.class)
                .build();
    }

    @Bean
    public FunctionCallback getTicketPolicyTool() {
        Function<PolicyRequest, String> fn = request -> {
            String topic = request.topic() != null ? request.topic().toLowerCase() : "";
            if (topic.contains("hoàn") || topic.contains("đổi") || topic.contains("trả") || topic.contains("hủy")) {
                return "Quy định hoàn tiền khi hủy vé:\n" +
                       "- Nếu chọn hoàn vé trước 1 ngày: Hoàn 100%\n" +
                       "- Nếu chọn hoàn vé trước 2 ngày: Hoàn 80%\n" +
                       "- Nếu chọn hoàn vé trước 1 tuần: Hoàn 50%\n" +
                       "- Nếu chọn hoàn vé trước 1 tháng: Hoàn 20%\n" +
                       "- Nếu chọn hoàn vé sau 1 tháng: Không được hoàn lại\n" +
                       "- Nếu đã qua thời gian bán vé: Không được hoàn lại";
            }
            if (topic.contains("tuổi") || topic.contains("trẻ em") || topic.contains("nhỏ") || topic.contains("quy định tuổi")) {
                return "Quy định độ tuổi tham gia tùy thuộc vào từng sự kiện cụ thể. Thông thường, trẻ em dưới 12 tuổi cần có người lớn đi kèm và tự chịu trách nhiệm về an toàn.";
            }
            if (topic.contains("ăn") || topic.contains("uống") || topic.contains("đồ ăn") || topic.contains("nước")) {
                return "Hầu hết các sự kiện không cho phép mang đồ ăn thức uống từ ngoài vào khu vực tổ chức. Khách hàng vui lòng sử dụng quầy ẩm thực phục vụ sẵn tại địa điểm.";
            }
            return "Quy định TicketBox: Vui lòng tuân thủ quy tắc ứng xử tại sự kiện và tuân thủ các quy định về an ninh, cấm mang vật dụng nguy hiểm. Đối với chính sách hủy/hoàn vé: " +
                   "Hoàn 100% trước 1 ngày, hoàn 80% trước 2 ngày, hoàn 50% trước 1 tuần, hoàn 20% trước 1 tháng, sau 1 tháng hoặc khi qua thời gian bán vé sẽ không được hoàn lại.";
        };

        return FunctionCallback.builder()
                .function("getTicketPolicyTool", fn)
                .description(
                        "Sử dụng công cụ này khi khách hàng hỏi về quy định hệ thống, chính sách hoàn/đổi/trả vé, độ tuổi tham gia, hoặc quy định mang đồ ăn thức uống vào sự kiện."
                )
                .inputType(PolicyRequest.class)
                .build();
    }

    public record PolicyRequest(String topic) {}

    // ─────────────────────────────────────────────────────────────────────────
    // Explicit Function implementation
    // Using a named static class (not anonymous/lambda) gives Spring AI
    // reliable generic-type introspection for the tool input schema.
    // ─────────────────────────────────────────────────────────────────────────

    static class EventSearchFunction implements Function<SearchEventRequest, String> {

        private static final Logger log = LoggerFactory.getLogger(EventSearchFunction.class);

        private final String baseUrl;
        private final ObjectMapper mapper;

        EventSearchFunction(String baseUrl, ObjectMapper mapper) {
            this.baseUrl = baseUrl;
            this.mapper = mapper;
        }

        @Override
        public String apply(SearchEventRequest request) {
            log.info("--- AI TOOL TRIGGERED: keyword = {}, maxPrice = {}, isFree = {}, startDate = {}, endDate = {}, location = {}, organizer = {} ---",
                    request.getKeyword(), request.getMaxPrice(), request.getIsFree(), request.getStartDate(), request.getEndDate(), request.getLocation(), request.getOrganizer());
            try {
                RestClient client = RestClient.builder().build();

                UriComponentsBuilder uri = UriComponentsBuilder
                        .fromHttpUrl(baseUrl + "/events/search-semantic");

                String keyword = request.getKeyword();
                uri.queryParam("keyword", (keyword != null && !keyword.isBlank()) ? keyword : "");

                if (request.getCategory() != null && !request.getCategory().isBlank()) {
                    uri.queryParam("category", request.getCategory().toUpperCase());
                }
                if (request.getCity() != null && !request.getCity().isBlank()) {
                    uri.queryParam("city", request.getCity());
                }
                if (request.getMaxPrice() != null) {
                    uri.queryParam("maxPrice", request.getMaxPrice());
                }
                if (request.getIsFree() != null) {
                    uri.queryParam("isFree", request.getIsFree());
                }
                if (request.getStartDate() != null && !request.getStartDate().isBlank()) {
                    uri.queryParam("startDate", request.getStartDate());
                }
                if (request.getEndDate() != null && !request.getEndDate().isBlank()) {
                    uri.queryParam("endDate", request.getEndDate());
                }
                if (request.getLocation() != null && !request.getLocation().isBlank()) {
                    uri.queryParam("location", request.getLocation());
                }
                if (request.getOrganizer() != null && !request.getOrganizer().isBlank()) {
                    uri.queryParam("organizer", request.getOrganizer());
                }

                uri.queryParam("page", 0).queryParam("size", 5);

                String finalUrl = uri.toUriString();
                log.info("Calling event-service URL: {}", finalUrl);

                JsonNode root = client.get()
                        .uri(finalUrl)
                        .retrieve()
                        .onStatus(HttpStatusCode::is4xxClientError, (req, resp) -> {
                            log.error("Client error from event-service: status = {}, body = {}", resp.getStatusCode(), resp.getStatusText());
                        })
                        .onStatus(HttpStatusCode::is5xxServerError, (req, resp) -> {
                            log.error("Server error from event-service: status = {}, body = {}", resp.getStatusCode(), resp.getStatusText());
                        })
                        .body(JsonNode.class);

                log.info("Raw JSON response from event-service: {}", mapper.writeValueAsString(root));

                // API response shape: { data: { content: [...] } }
                JsonNode content = null;
                if (root != null && root.has("data")) {
                    JsonNode data = root.get("data");
                    if (data.has("content")) {
                        content = data.get("content");
                    }
                }

                if (content == null || !content.isArray() || content.isEmpty()) {
                    log.info("--- EVENT SERVICE RETURNED 0 RESULTS ---");
                    return "Không tìm thấy sự kiện nào phù hợp với yêu cầu.";
                }

                List<String> formattedEvents = new ArrayList<>();
                for (JsonNode node : content) {
                    long id = node.path("id").asLong();
                    String title = node.path("title").asText("");
                    String city = node.path("city").asText("");
                    String location = node.path("location").asText("");
                    String startTime = node.path("startTime").asText("");
                    String priceDisplay = node.path("priceDisplay").asText("Miễn phí");

                    String fullLocation = location;
                    if (city != null && !city.isBlank() && !location.toLowerCase().contains(city.toLowerCase())) {
                        fullLocation = location + ", " + city;
                    }

                    String item = String.format(
                        "**%s**\n- 📍 Địa điểm: %s\n- ⏰ Thời gian: %s\n- 💵 Giá vé: %s\n👉 **[🎫 Xem chi tiết & Đặt vé](/events/%d)**\n",
                        title,
                        fullLocation,
                        startTime,
                        priceDisplay,
                        id
                    );
                    formattedEvents.add(item);
                }

                String formattedResult = String.join("\n", formattedEvents);
                return "Dưới đây là các sự kiện tìm thấy:\n\n" + formattedResult;

            } catch (Exception ex) {
                return "{\"error\": \"Cannot reach event search service: "
                        + ex.getMessage().replaceAll("\"", "'") + "\"}";
            }
        }
    }
}
