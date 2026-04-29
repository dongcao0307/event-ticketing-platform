package fit.iuh.event_service.controllers;

import fit.iuh.event_service.dtos.EventReq;
import fit.iuh.event_service.dtos.EventSummaryResponse;
import fit.iuh.event_service.dtos.FullEventCreateRequest;
import fit.iuh.event_service.dtos.PerformanceReq;
import fit.iuh.event_service.models.Event;
import fit.iuh.event_service.models.EventPerformance;
import fit.iuh.event_service.services.OrganizerEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/organizer/events")
@RequiredArgsConstructor
public class OrganizerEventController {

    private final OrganizerEventService organizerEventService;

    // 1. Tạo sự kiện
    @PostMapping
    public ResponseEntity<Event> createEvent(
            @RequestHeader("X-User-Id") Long organizerId,
            @RequestBody EventReq req) {
        return ResponseEntity.ok(organizerEventService.createEvent(organizerId, req));
    }

    // 2. Cập nhật sự kiện
    @PutMapping("/{eventId}")
    public ResponseEntity<Event> updateEvent(
            @RequestHeader("X-User-Id") Long organizerId,
            @PathVariable Long eventId,
            @RequestBody EventReq req) {
        return ResponseEntity.ok(organizerEventService.updateEvent(organizerId, eventId, req));
    }

    // 3. Tìm kiếm / Xem danh sách sự kiện
//    @GetMapping
//    public ResponseEntity<List<Event>> getMyEvents(
//            @RequestHeader("X-User-Id") Long organizerId,
//            @RequestParam(required = false) String keyword) {
//        return ResponseEntity.ok(organizerEventService.getMyEvents(organizerId, keyword));
//    }
    // 4. Tạo suất diễn (Performance)
    @PostMapping("/{eventId}/performances")
    public ResponseEntity<EventPerformance> createPerformance(
            @RequestHeader("X-User-Id") Long organizerId,
            @PathVariable Long eventId,
            @RequestBody PerformanceReq req) {
        return ResponseEntity.ok(organizerEventService.createPerformance(organizerId, eventId, req));
    }

    // 5. Xem chi tiết 1 sự kiện
    @GetMapping("/{eventId}")
    public ResponseEntity<Event> getEventById(
            @RequestHeader("X-User-Id") Long organizerId,
            @PathVariable Long eventId) {
        return ResponseEntity.ok(organizerEventService.getEventById(organizerId, eventId));
    }

    // 6. Xóa sự kiện
    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(
            @RequestHeader("X-User-Id") Long organizerId,
            @PathVariable Long eventId) {
        organizerEventService.deleteEvent(organizerId, eventId);
        return ResponseEntity.noContent().build(); // Trả về status 204 (No Content) khi xóa thành công
    }

    // 7. Lấy danh sách suất diễn của 1 sự kiện
    @GetMapping("/{eventId}/performances")
    public ResponseEntity<List<EventPerformance>> getPerformancesByEventId(
            @RequestHeader("X-User-Id") Long organizerId,
            @PathVariable Long eventId) {
        return ResponseEntity.ok(organizerEventService.getPerformancesByEventId(organizerId, eventId));
    }

    // ==========================================
    // API GOM CHUNG TỪ BƯỚC 1 ĐẾN 4 (WIZARD FORM)
    // ==========================================
    @PostMapping("/full")
    public ResponseEntity<?> createFullEvent(
            @RequestHeader("X-User-Id") Long organizerId,
            @RequestBody FullEventCreateRequest request) {

        // 📸 CAMERA 1: Đón khách ở cửa
        System.out.println("==================================================");
        System.out.println(">>> [DEBUG 1] ĐÃ VÀO CONTROLLER. Tên sự kiện: " + request.getTitle());
        System.out.println("==================================================");

        try {
            // 📸 CAMERA 2: Chuyển hàng xuống Service
            System.out.println(">>> [DEBUG 2] Đang gọi Service để lưu Database...");
            Event createdEvent = organizerEventService.createFullEvent(organizerId, request);

            // 📸 CAMERA 3: Xác nhận lưu Database thành công
            System.out.println(">>> [DEBUG 3] LƯU DB THÀNH CÔNG! Đã tạo ID sự kiện: " + createdEvent.getId());

            // 🛡️ CHIÊU BỌC THÉP TRÁNH TRÀN RAM: Tạo Map thay vì trả nguyên Entity
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Tạo sự kiện mega thành công!");
            response.put("eventId", createdEvent.getId());

            // 📸 CAMERA 4: Trả hàng về Frontend
            System.out.println(">>> [DEBUG 4] Gửi phản hồi 200 OK về cho Frontend...");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            // Bắt các lỗi do Logic, Data (Exception)
            System.err.println(">>> [LỖI EXCEPTION] Xảy ra lỗi Logic/Database:");
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi hệ thống khi lưu toàn bộ sự kiện: " + e.getMessage());

        } catch (Error err) {
            // LƯỚI TRỜI LỒNG LỘNG: Bắt cả lỗi tràn RAM (StackOverflowError)
            System.err.println(">>> [LỖI SERVER NGHIÊM TRỌNG - ERROR] Tràn bộ nhớ / Sập luồng:");
            err.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Lỗi hệ thống nghiêm trọng: Máy chủ bị quá tải hoặc vòng lặp vô tận.");
        }
    }

    @GetMapping
    public ResponseEntity<List<EventSummaryResponse>> getMyEvents(
            @RequestHeader("X-User-Id") Long organizerId,
            @RequestParam(required = false) String keyword) { // Thêm cái rổ này vào

        // Truyền keyword xuống Service
        List<EventSummaryResponse> events = organizerEventService.getEventsByOrganizerId(organizerId, keyword);
        return ResponseEntity.ok(events);
    }
}
