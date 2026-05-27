package fit.iuh.event_service.controllers;

import fit.iuh.event_service.dtos.ApiResponse;
import fit.iuh.event_service.dtos.EventResponse;
import fit.iuh.event_service.services.FavoriteEventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
@Slf4j
public class FavoriteEventController {

    private final FavoriteEventService favoriteEventService;

    /**
     * Toggle favorite status of an event
     * POST /events/{eventId}/favorite/toggle
     */
    @PostMapping("/{eventId}/favorite/toggle")
    public ResponseEntity<ApiResponse<Boolean>> toggleFavorite(
            @PathVariable Long eventId,
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(ApiResponse.error("Vui lòng đăng nhập để thực hiện tác vụ này"));
        }
        String email = authentication.getName();
        log.info("Request to toggle favorite for event: {} by user: {}", eventId, email);
        
        boolean result = favoriteEventService.toggleFavorite(email, eventId);
        return ResponseEntity.ok(ApiResponse.success(
                result ? "Đã thêm vào danh sách yêu thích" : "Đã xóa khỏi danh sách yêu thích",
                result
        ));
    }

    /**
     * Get list of favorite events for the current user
     * GET /events/favorites
     */
    @GetMapping("/favorites")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getFavorites(
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(ApiResponse.error("Vui lòng đăng nhập để xem danh sách yêu thích"));
        }
        String email = authentication.getName();
        log.info("Request to get favorite events for user: {}", email);
        
        List<EventResponse> favorites = favoriteEventService.getFavoriteEvents(email);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách yêu thích thành công", favorites));
    }

    /**
     * Check if a specific event is favorited by the current user
     * GET /events/{eventId}/favorite/status
     */
    @GetMapping("/{eventId}/favorite/status")
    public ResponseEntity<ApiResponse<Boolean>> getFavoriteStatus(
            @PathVariable Long eventId,
            Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            // If not logged in, return false status
            return ResponseEntity.ok(ApiResponse.success("Chưa đăng nhập", false));
        }
        String email = authentication.getName();
        boolean isFavorited = favoriteEventService.isFavorited(email, eventId);
        return ResponseEntity.ok(ApiResponse.success("Lấy trạng thái yêu thích thành công", isFavorited));
    }
}
