package fit.iuh.ai_service.controllers;

import fit.iuh.ai_service.dtos.EmbeddingRequest;
import fit.iuh.ai_service.dtos.EmbeddingResponse;
import fit.iuh.ai_service.services.EmbeddingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/embeddings")
public class EmbeddingController {

    private final EmbeddingService embeddingService;

    public EmbeddingController(EmbeddingService embeddingService) {
        this.embeddingService = embeddingService;
    }

    @PostMapping
    public ResponseEntity<EmbeddingResponse> generateEmbedding(@RequestBody EmbeddingRequest request) {
        if (request.getText() == null || request.getText().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        double[] vector = embeddingService.embed(request.getText());
        return ResponseEntity.ok(new EmbeddingResponse(vector));
    }
}
