package fit.iuh.event_service.controllers;

import fit.iuh.event_service.dtos.ApiResponse;
import fit.iuh.event_service.dtos.EventResponse;
import fit.iuh.event_service.dtos.PageResponse;
import fit.iuh.event_service.services.SemanticSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class SemanticEventController {

    private final SemanticSearchService semanticSearchService;

    @GetMapping("/search-semantic")
    public ResponseEntity<ApiResponse<PageResponse<EventResponse>>> searchSemantic(
            @RequestParam String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Boolean isFree,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        List<EventResponse> result = semanticSearchService.search(
                keyword, category, city, status, maxPrice, isFree, startDate, endDate, page, size);

        PageResponse<EventResponse> pageResponse = PageResponse.<EventResponse>builder()
                .content(result)
                .page(page)
                .size(size)
                .totalElements(result.size())
                .totalPages(1)
                .last(true)
                .build();

        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm semantic thành công", pageResponse));
    }

    private final fit.iuh.event_service.repositories.EventRepository eventRepository;
    private final fit.iuh.event_service.services.EmbeddingUpsertService embeddingUpsertService;

    @PostMapping("/reindex")
    public ResponseEntity<ApiResponse<String>> reindexAllEvents() {
        List<fit.iuh.event_service.models.Event> allEvents = eventRepository.findAll();
        int count = 0;
        for (fit.iuh.event_service.models.Event event : allEvents) {
            try {
                embeddingUpsertService.upsertEventEmbedding(event);
                count++;
            } catch (Exception e) {
                System.err.println("Lỗi khi tạo embedding cho event " + event.getId() + ": " + e.getMessage());
                e.printStackTrace();
            }
        }
        return ResponseEntity.ok(ApiResponse.success("Cập nhật embedding thành công cho " + count + " sự kiện", null));
    }
}
