package fit.iuh.event_service.services;

import fit.iuh.event_service.models.Event;

public interface EmbeddingUpsertService {
    void upsertEventEmbedding(Event event);
}
