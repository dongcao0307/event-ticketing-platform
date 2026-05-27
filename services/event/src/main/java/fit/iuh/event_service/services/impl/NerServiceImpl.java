package fit.iuh.event_service.services.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import fit.iuh.event_service.dtos.NerResponse;
import fit.iuh.event_service.services.NerService;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class NerServiceImpl implements NerService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public NerServiceImpl(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder().build();
    }

    @Override
    public NerResponse extractEntities(String text) {
        String url = "http://ai-service:8091/api/v1/ner";

        try {
            var payload = objectMapper.createObjectNode();
            payload.put("text", text);

            return restClient.post()
                    .uri(url)
                    .header("Content-Type", "application/json")
                    .body(payload)
                    .retrieve()
                    .body(NerResponse.class);
        } catch (Exception e) {
            System.err.println("Failed to call internal ai-service for NER: " + e.getMessage());
            return new NerResponse(null, null, text, null);
        }
    }
}
