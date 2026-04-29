package fit.iuh.event_service.controllers;

import fit.iuh.event_service.dtos.ApiResponse;
import fit.iuh.event_service.dtos.EventResponse;
import fit.iuh.event_service.dtos.PageResponse;
import fit.iuh.event_service.services.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PageResponse<EventResponse>>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        PageResponse<EventResponse> result = eventService.searchEvents(keyword, category, city, status, page, size);
        return ResponseEntity.ok(ApiResponse.success("Tìm kiếm thành công", result));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> getById(@PathVariable Long id) {
        EventResponse event = eventService.getEventById(id);
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin thành công", event));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getFeatured() {
        return ResponseEntity.ok(ApiResponse.success("Lấy sự kiện nổi bật thành công", eventService.getFeaturedEvents()));
    }

    @GetMapping("/trending")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getTrending() {
        return ResponseEntity.ok(ApiResponse.success("Lấy sự kiện trending thành công", eventService.getTrendingEvents()));
    }

    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getLatest() {
        return ResponseEntity.ok(ApiResponse.success("Lấy sự kiện mới nhất thành công", eventService.getLatestEvents()));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(ApiResponse.success("Lấy sự kiện theo thể loại thành công", eventService.getEventsByCategory(category)));
    }
}
