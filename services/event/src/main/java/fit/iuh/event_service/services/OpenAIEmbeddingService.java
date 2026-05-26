package fit.iuh.event_service.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class OpenAIEmbeddingService implements EmbeddingService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public OpenAIEmbeddingService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder().build();
    }

    @Override
    public double[] embed(String text) {
        String url = "http://ai-service:8091/api/v1/embeddings";

        try {
            var payload = objectMapper.createObjectNode();
            payload.put("text", text);

            JsonNode root = restClient.post()
                    .uri(url)
                    .header("Content-Type", "application/json")
                    .body(payload)
                    .retrieve()
                    .body(JsonNode.class);

            if (root == null || !root.has("embedding")) {
                throw new RuntimeException("Invalid response from ai-service");
            }

            JsonNode embeddingNode = root.get("embedding");
            double[] result = new double[embeddingNode.size()];
            for (int i = 0; i < embeddingNode.size(); i++) {
                result[i] = embeddingNode.get(i).asDouble();
            }
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Failed to call internal ai-service: " + e.getMessage(), e);
        }
    }
}

