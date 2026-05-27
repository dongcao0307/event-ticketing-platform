package fit.iuh.ai_service.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;

@Service
public class OpenAIEmbeddingService implements EmbeddingService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${openai.embedding.model:text-embedding-3-small}")
    private String model;

    public OpenAIEmbeddingService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder().build();
    }

    @Override
    public double[] embed(String text) {
        String apiKey = System.getenv("GEMINI_API_KEY");
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("Missing GEMINI_API_KEY environment variable");
        }

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=" + apiKey;

        try {
            var payload = objectMapper.createObjectNode();
            payload.put("model", "models/gemini-embedding-001");
            
            var contentNode = objectMapper.createObjectNode();
            var partsArray = objectMapper.createArrayNode();
            var partNode = objectMapper.createObjectNode();
            partNode.put("text", text);
            partsArray.add(partNode);
            contentNode.set("parts", partsArray);
            
            payload.set("content", contentNode);

            JsonNode root = restClient.post()
                    .uri(url)
                    .header("Content-Type", "application/json")
                    .body(payload)
                    .retrieve()
                    .body(JsonNode.class);

            JsonNode valuesNode = root.get("embedding").get("values");
            List<Double> vec = new ArrayList<>();
            for (JsonNode v : valuesNode) {
                vec.add(v.asDouble());
            }

            double[] result = new double[vec.size()];
            for (int i = 0; i < vec.size(); i++) {
                result[i] = vec.get(i);
            }
            return result;
        } catch (Exception e) {
            throw new RuntimeException("Failed to call Gemini embeddings: " + e.getMessage(), e);
        }
    }
}
