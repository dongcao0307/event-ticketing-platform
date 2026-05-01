package fit.iuh.event_service.services;

import fit.iuh.event_service.dtos.EventReq;
import fit.iuh.event_service.dtos.EventSummaryResponse;
import fit.iuh.event_service.dtos.FullEventCreateRequest;
import fit.iuh.event_service.dtos.PerformanceReq;
import fit.iuh.event_service.models.Event;
import fit.iuh.event_service.models.EventPerformance;
import java.util.List;

public interface OrganizerEventService {
    Event createEvent(Long organizerId, EventReq req);
    Event updateEvent(Long organizerId, Long eventId, EventReq req);
//    List<Event> getMyEvents(Long organizerId, String keyword);
    EventPerformance createPerformance(Long organizerId, Long eventId, PerformanceReq req);
    // 5. Xem chi tiết 1 sự kiện
    Event getEventById(Long organizerId, Long eventId);

    // 6. Xóa sự kiện
    void deleteEvent(Long organizerId, Long eventId);

    // 7. Lấy danh sách suất diễn của 1 sự kiện
    List<EventPerformance> getPerformancesByEventId(Long organizerId, Long eventId);
    Event createFullEvent(Long organizerId, FullEventCreateRequest request);
    List<EventSummaryResponse> getEventsByOrganizerId(Long organizerId, String keyword);
}