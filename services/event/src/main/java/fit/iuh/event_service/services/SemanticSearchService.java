package fit.iuh.event_service.services;

import fit.iuh.event_service.dtos.EventResponse;
import fit.iuh.event_service.models.Event;

import java.util.List;
import java.util.Map;

public interface SemanticSearchService {
    List<EventResponse> search(
            String keyword,
            String category,
            String city,
            String status,
            int page,
            int size);
}
