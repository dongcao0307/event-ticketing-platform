package fit.iuh.event_service.feature.admin_event.service;

import fit.iuh.event_service.entity.Event;
import fit.iuh.event_service.entity.EventPerformance;
import fit.iuh.event_service.entity.EventStatus;
import fit.iuh.event_service.feature.admin_event.dto.EventAdminDetailDTO;
import fit.iuh.event_service.feature.admin_event.dto.EventAdminListDTO;
import fit.iuh.event_service.repository.EventRepository;
import fit.iuh.event_service.repository.EventPerformanceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AdminEventService {
    private final EventRepository eventRepository;
    private final EventPerformanceRepository performanceRepository;
    
    /**
     * Lấy danh sách events theo trạng thái
     */
    public List<EventAdminListDTO> getEventsByStatus(EventStatus status) {
        log.info("Fetching events with status: {}", status);
        List<Event> events = status == null 
            ? eventRepository.findAll() 
            : eventRepository.findByStatus(status);
        return events.stream()
                .map(this::convertToListDTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Lấy chi tiết sự kiện
     */
    public EventAdminDetailDTO getEventDetail(Long eventId) {
        log.info("Fetching event detail: {}", eventId);
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found: " + eventId));
        return convertToDetailDTO(event);
    }
    
    /**
     * Duyệt sự kiện
     */
    public EventAdminDetailDTO approveEvent(Long eventId) {
        log.info("Approving event: {}", eventId);
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found: " + eventId));
        
        if (event.getStatus() != EventStatus.DRAFT) {
            throw new RuntimeException("Only DRAFT events can be approved");
        }
        
        event.setStatus(EventStatus.PUBLISHER);
        Event saved = eventRepository.save(event);
        log.info("Event approved successfully: {}", eventId);
        return convertToDetailDTO(saved);
    }
    
    /**
     * Từ chối sự kiện
     */
    public EventAdminDetailDTO rejectEvent(Long eventId, String reason) {
        log.info("Rejecting event: {}, reason: {}", eventId, reason);
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found: " + eventId));
        
        if (event.getStatus() != EventStatus.DRAFT) {
            throw new RuntimeException("Only DRAFT events can be rejected");
        }
        
        event.setStatus(EventStatus.CANCELLED);
        Event saved = eventRepository.save(event);
        log.info("Event rejected successfully: {}", eventId);
        return convertToDetailDTO(saved);
    }
    
    /**
     * Khóa sự kiện (CANCEL)
     */
    public EventAdminDetailDTO lockEvent(Long eventId, String reason) {
        log.info("Locking event: {}, reason: {}", eventId, reason);
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found: " + eventId));
        
        event.setStatus(EventStatus.CANCELLED);
        Event saved = eventRepository.save(event);
        log.info("Event locked successfully: {}", eventId);
        return convertToDetailDTO(saved);
    }
    
    /**
     * Search events theo tiêu đề hoặc organizer
     */
    public List<EventAdminListDTO> searchEvents(String query, EventStatus status) {
        log.info("Searching events with query: {}, status: {}", query, status);
        List<Event> allEvents = status == null 
            ? eventRepository.findAll() 
            : eventRepository.findByStatus(status);
        
        return allEvents.stream()
                .filter(e -> e.getTitle().toLowerCase().contains(query.toLowerCase()))
                .map(this::convertToListDTO)
                .collect(Collectors.toList());
    }
    
    // Helper methods
    private EventAdminListDTO convertToListDTO(Event event) {
        return EventAdminListDTO.builder()
                .id(event.getId())
                .title(event.getTitle())
                .organizerId(event.getOrganizerId())
                .category(getCategoryName(event.getCategoryId()))
                .type(event.getVenue() != null ? "Offline" : "Online")
                .createdAt(event.getCreatedAt())
                .status(event.getStatus())
                .thumbnailUrl(event.getThumbnailUrl())
                .build();
    }
    
    private EventAdminDetailDTO convertToDetailDTO(Event event) {
        // Get first performance for start/end dates by querying from repository
        String location = "Online";
        java.time.LocalDateTime startDate = null;
        java.time.LocalDateTime endDate = null;
        
        if (event.getVenue() != null) {
            location = event.getVenue().getName();
        }
        
        // Query performance from database by eventId
        List<EventPerformance> performances = performanceRepository.findByEventId(event.getId());
        if (!performances.isEmpty()) {
            EventPerformance perf = performances.get(0);
            // Convert Unix timestamp to LocalDateTime
            startDate = java.time.Instant.ofEpochMilli(perf.getStartTime())
                    .atZone(java.time.ZoneId.systemDefault())
                    .toLocalDateTime();
            endDate = perf.getEndTime();
        }
        
        return EventAdminDetailDTO.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .status(event.getStatus())
                .category(getCategoryName(event.getCategoryId()))
                .type(event.getVenue() != null ? "Offline" : "Online")
                .startDate(startDate)
                .endDate(endDate)
                .location(location)
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .build();
    }
    
    private String getCategoryName(Long categoryId) {
        // TODO: Call category service hoặc lấy từ database
        return "Category #" + categoryId;
    }
}
