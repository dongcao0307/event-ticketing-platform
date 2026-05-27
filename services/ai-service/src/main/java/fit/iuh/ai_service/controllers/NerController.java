package fit.iuh.ai_service.controllers;

import fit.iuh.ai_service.dtos.NerRequest;
import fit.iuh.ai_service.dtos.NerResponse;
import fit.iuh.ai_service.services.NerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ner")
public class NerController {

    private final NerService nerService;

    public NerController(NerService nerService) {
        this.nerService = nerService;
    }

    @PostMapping
    public ResponseEntity<NerResponse> extractEntities(@RequestBody NerRequest request) {
        if (request.getText() == null || request.getText().isBlank()) {
            return ResponseEntity.badRequest().build();
        }
        NerResponse response = nerService.extractEntities(request.getText());
        return ResponseEntity.ok(response);
    }
}
