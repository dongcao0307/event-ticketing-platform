package fit.iuh.event_service.feature.admin_event.controller;

import fit.iuh.event_service.entity.EventStatus;
import fit.iuh.event_service.feature.admin_event.dto.ApiResponseDTO;
import fit.iuh.event_service.feature.admin_event.dto.EventAdminDetailDTO;
import fit.iuh.event_service.feature.admin_event.dto.EventAdminListDTO;
import fit.iuh.event_service.feature.admin_event.dto.EventApprovalRequestDTO;
import fit.iuh.event_service.feature.admin_event.service.AdminEventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/events")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AdminEventController {
    private final AdminEventService adminEventService;
    
    /**
     * GET /api/admin/events
     * Lấy danh sách sự kiện với filter theo status
     * Query params: status=DRAFT|PUBLISHER|CANCELLED
     */
    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<EventAdminListDTO>>> getAllEvents(
            @RequestParam(required = false) EventStatus status,
            @RequestParam(required = false) String search) {
        try {
            List<EventAdminListDTO> events;
            if (search != null && !search.isEmpty()) {
                events = adminEventService.searchEvents(search, status);
            } else {
                events = adminEventService.getEventsByStatus(status);
            }
            return ResponseEntity.ok(
                    ApiResponseDTO.success("Events retrieved successfully", events)
            );
        } catch (Exception e) {
            log.error("Error fetching events", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponseDTO.error("Failed to fetch events", "FETCH_ERROR"));
        }
    }
    
    /**
     * GET /api/admin/events/{id}
     * Lấy chi tiết một sự kiện
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<EventAdminDetailDTO>> getEventDetail(
            @PathVariable Long id) {
        try {
            EventAdminDetailDTO event = adminEventService.getEventDetail(id);
            return ResponseEntity.ok(
                    ApiResponseDTO.success("Event detail retrieved successfully", event)
            );
        } catch (Exception e) {
            log.error("Error fetching event detail: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponseDTO.error("Event not found", "EVENT_NOT_FOUND"));
        }
    }
    
    /**
     * POST /api/admin/events/{id}/approve
     * Duyệt sự kiện (DRAFT -> PUBLISHER)
     */
    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResponseDTO<EventAdminDetailDTO>> approveEvent(
            @PathVariable Long id) {
        try {
            EventAdminDetailDTO event = adminEventService.approveEvent(id);
            return ResponseEntity.ok(
                    ApiResponseDTO.success("Event approved successfully", event)
            );
        } catch (Exception e) {
            log.error("Error approving event: {}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponseDTO.error(e.getMessage(), "APPROVAL_ERROR"));
        }
    }
    
    /**
     * POST /api/admin/events/{id}/reject
     * Từ chối sự kiện (DRAFT -> CANCELLED)
     */
    @PostMapping("/{id}/reject")
    public ResponseEntity<ApiResponseDTO<EventAdminDetailDTO>> rejectEvent(
            @PathVariable Long id,
            @RequestBody EventApprovalRequestDTO request) {
        try {
            EventAdminDetailDTO event = adminEventService.rejectEvent(id, request.getReason());
            return ResponseEntity.ok(
                    ApiResponseDTO.success("Event rejected successfully", event)
            );
        } catch (Exception e) {
            log.error("Error rejecting event: {}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponseDTO.error(e.getMessage(), "REJECTION_ERROR"));
        }
    }
    
    /**
     * POST /api/admin/events/{id}/lock
     * Khóa sự kiện (không cho phép organizer chỉnh sửa)
     */
    @PostMapping("/{id}/lock")
    public ResponseEntity<ApiResponseDTO<EventAdminDetailDTO>> lockEvent(
            @PathVariable Long id,
            @RequestBody EventApprovalRequestDTO request) {
        try {
            EventAdminDetailDTO event = adminEventService.lockEvent(id, request.getReason());
            return ResponseEntity.ok(
                    ApiResponseDTO.success("Event locked successfully", event)
            );
        } catch (Exception e) {
            log.error("Error locking event: {}", id, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponseDTO.error(e.getMessage(), "LOCK_ERROR"));
        }
    }
    
    /**
     * GET /api/admin/events/search
     * Tìm kiếm sự kiện
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponseDTO<List<EventAdminListDTO>>> searchEvents(
            @RequestParam String query,
            @RequestParam(required = false) EventStatus status) {
        try {
            List<EventAdminListDTO> events = adminEventService.searchEvents(query, status);
            return ResponseEntity.ok(
                    ApiResponseDTO.success("Search completed", events)
            );
        } catch (Exception e) {
            log.error("Error searching events", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponseDTO.error("Search failed", "SEARCH_ERROR"));
        }
    }
}
