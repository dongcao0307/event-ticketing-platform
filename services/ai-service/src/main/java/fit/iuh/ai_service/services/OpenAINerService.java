package fit.iuh.ai_service.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import fit.iuh.ai_service.dtos.NerResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class OpenAINerService implements NerService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public OpenAINerService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder().build();
    }

    @Override
    public NerResponse extractEntities(String text) {
        String apiKey = System.getenv("GEMINI_API_KEY");
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("Missing GEMINI_API_KEY environment variable");
        }

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

        try {
            var payload = objectMapper.createObjectNode();
            
            String prompt = "You are an AI assistant that extracts entities from an event search query.\\n" +
                    "Extract the following entities:\\n" +
                    "1. category: The event category. Allowed values: THEATER, MUSIC, SPORTS, WORKSHOP, FESTIVAL, COMEDY, EXHIBITION, OTHER. If not found, return null.\\n" +
                    "2. city: The city. If the query mentions 'Sài Gòn', 'SG' or 'HCM', return 'Hồ Chí Minh'. If 'HN', return 'Hà Nội'. If not found, return null.\\n" +
                    "3. cleanedKeyword: The remaining part of the text after removing the category, city, and price information, keep it clean and concise. If the whole text is just about category/city/price, return an empty string.\\n" +
                    "4. maxPrice: The maximum price budget mentioned by the user, in VND. For example, 'dưới 500k' -> 500000, 'free'/'miễn phí' -> 0. If no price constraint is mentioned, return null.\\n\\n" +
                    "You MUST respond in ONLY valid JSON format without any markdown wrappers or markdown code blocks (no ```json). The format must be exactly like this:\\n" +
                    "{\\n" +
                    "  \\\"category\\\": \\\"MUSIC\\\",\\n" +
                    "  \\\"city\\\": \\\"Hồ Chí Minh\\\",\\n" +
                    "  \\\"cleanedKeyword\\\": \\\"Hà Anh Tuấn\\\",\\n" +
                    "  \\\"maxPrice\\\": 500000\\n" +
                    "}\\n\\n" +
                    "User Query: " + text;

            var contentNode = objectMapper.createObjectNode();
            var partsArray = objectMapper.createArrayNode();
            var partNode = objectMapper.createObjectNode();
            partNode.put("text", prompt);
            partsArray.add(partNode);
            contentNode.set("parts", partsArray);
            
            var contentArray = objectMapper.createArrayNode();
            contentArray.add(contentNode);
            
            payload.set("contents", contentArray);
            
            // Set generationConfig to force JSON output
            var generationConfig = objectMapper.createObjectNode();
            generationConfig.put("responseMimeType", "application/json");
            payload.set("generationConfig", generationConfig);

            JsonNode root = restClient.post()
                    .uri(url)
                    .header("Content-Type", "application/json")
                    .body(payload)
                    .retrieve()
                    .body(JsonNode.class);

            JsonNode candidates = root.get("candidates");
            if (candidates != null && candidates.size() > 0) {
                JsonNode content = candidates.get(0).get("content");
                if (content != null && content.has("parts")) {
                    String jsonText = content.get("parts").get(0).get("text").asText();
                    return objectMapper.readValue(jsonText, NerResponse.class);
                }
            }
            
            return new NerResponse(null, null, text, null);
        } catch (Exception e) {
            // Fallback to original text on error
            System.err.println("NER failed: " + e.getMessage());
            return new NerResponse(null, null, text, null);
        }
    }
}
