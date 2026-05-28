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
                        "Input parameters (fill only what is present in query or can be inferred): " +
                        "- keyword: free-text search query (e.g. name of singer, band, show). " +
                        "- category: MUSIC/THEATER/SPORTS/WORKSHOP/FESTIVAL/COMEDY/EXHIBITION/OTHER. " +
                        "- city: Hồ Chí Minh, Hà Nội, Đà Nẵng, etc. " +
                        "- maxPrice: maximum price limit (as a raw double value, e.g. if user says 'dưới 500k' set to 500000.0, if 'tầm 1 triệu' set to 1000000.0). Leave null/empty if the user did not specify a price constraint. " +
                        "- isFree: set to true if user specifically asks for free or zero-cost events (e.g. 'miễn phí', 'free', 'không tốn tiền'). Leave null/empty if not requested. " +
                        "- startDate: start date of search window in ISO format YYYY-MM-DD (calculate the exact ISO date based on the current date provided in system prompt). " +
                        "- endDate: end date of search window in ISO format YYYY-MM-DD. " +
                        "Returns JSON array with id, title, city, location, startTime, priceDisplay, and bookingUrl for each event."
                )
                .inputType(SearchEventRequest.class)
                .build();
    }

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
            log.info("--- AI TOOL TRIGGERED: keyword = {}, maxPrice = {}, isFree = {}, startDate = {}, endDate = {} ---",
                    request.getKeyword(), request.getMaxPrice(), request.getIsFree(), request.getStartDate(), request.getEndDate());
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
                    return mapper.writeValueAsString(
                            List.of("No events found matching your query."));
                }

                List<EventSummary> summaries = new ArrayList<>();
                for (JsonNode node : content) {
                    EventSummary s = new EventSummary();
                    s.setId(node.path("id").asLong());
                    s.setTitle(node.path("title").asText(""));
                    s.setCity(node.path("city").asText(""));
                    s.setLocation(node.path("location").asText(""));
                    s.setStartTime(node.path("startTime").asText(""));
                    s.setPriceDisplay(node.path("priceDisplay").asText("Free"));

                    JsonNode minPriceNode = node.path("minPrice");
                    if (!minPriceNode.isMissingNode() && !minPriceNode.isNull()) {
                        s.setMinPrice(new BigDecimal(minPriceNode.asText()));
                    }

                    // Deep link to the event booking page
                    s.setBookingUrl("https://localhost:8443/event/" + s.getId());
                    summaries.add(s);
                }

                return mapper.writeValueAsString(summaries);

            } catch (Exception ex) {
                return "{\"error\": \"Cannot reach event search service: "
                        + ex.getMessage().replaceAll("\"", "'") + "\"}";
            }
        }
    }
}
