package fit.iuh.event_service.service;

import fit.iuh.event_service.dto.EventResponse;
import fit.iuh.event_service.dto.PageResponse;
import fit.iuh.event_service.entity.enums.EventCategory;
import fit.iuh.event_service.entity.enums.EventStatus;
import fit.iuh.event_service.exception.ResourceNotFoundException;
import fit.iuh.event_service.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public PageResponse<EventResponse> searchEvents(
            String keyword,
            String category,
            String city,
            String status,
            int page,
            int size) {

        EventCategory cat = null;
        if (category != null && !category.isBlank()) {
            try { cat = EventCategory.valueOf(category.toUpperCase()); } catch (Exception ignored) {}
        }

        EventStatus st = null;
        if (status != null && !status.isBlank()) {
            try { st = EventStatus.valueOf(status.toUpperCase()); } catch (Exception ignored) {}
        }

        Pageable pageable = PageRequest.of(page, size);
        var pageResult = eventRepository.searchEvents(
                keyword != null && !keyword.isBlank() ? keyword : null,
                cat,
                city != null && !city.isBlank() ? city : null,
                st,
                pageable
        );

        return PageResponse.fromPage(pageResult.map(EventResponse::fromEntity));
    }

    @Transactional
    public EventResponse getEventById(Long id) {
        var event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sự kiện với id: " + id));
        eventRepository.incrementViewCount(id);
        return EventResponse.fromEntity(event);
    }

    public List<EventResponse> getFeaturedEvents() {
        return eventRepository.findByIsFeaturedTrueOrderByStartTimeAsc()
                .stream().map(EventResponse::fromEntity).toList();
    }

    public List<EventResponse> getTrendingEvents() {
        return eventRepository.findTop10ByOrderByViewCountDesc()
                .stream().map(EventResponse::fromEntity).toList();
    }

    public List<EventResponse> getLatestEvents() {
        return eventRepository.findTop10ByOrderByCreatedAtDesc()
                .stream().map(EventResponse::fromEntity).toList();
    }

    public List<EventResponse> getEventsByCategory(String category) {
        EventCategory cat;
        try { cat = EventCategory.valueOf(category.toUpperCase()); }
        catch (Exception e) { return List.of(); }
        return eventRepository.findByCategoryOrderByStartTimeAsc(cat)
                .stream().map(EventResponse::fromEntity).toList();
    }
}
