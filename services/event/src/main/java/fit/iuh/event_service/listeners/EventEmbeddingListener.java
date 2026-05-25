package fit.iuh.event_service.listeners;

import fit.iuh.event_service.models.Event;
import fit.iuh.event_service.services.EmbeddingUpsertService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * MVP placeholder: wiring this listener to entity lifecycle hooks would require
 * 
 * @EntityListeners or application events. For now we upsert embedding via
 *                  service methods.
 */
@Component
@RequiredArgsConstructor
public class EventEmbeddingListener {

    private final EmbeddingUpsertService embeddingUpsertService;

    public void onEventSaved(Event event) {
        if (event == null || event.getId() == null)
            return;
        // best-effort
        try {
            embeddingUpsertService.upsertEventEmbedding(event);
        } catch (Exception ignored) {
        }
    }
}
