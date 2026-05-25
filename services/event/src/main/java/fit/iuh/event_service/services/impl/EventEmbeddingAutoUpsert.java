package fit.iuh.event_service.services.impl;

import fit.iuh.event_service.models.Event;
import fit.iuh.event_service.services.EmbeddingUpsertService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * MVP: Chỉ để minh hoạ. Hiện tại project chưa publish Spring domain events cho
 * Event entity,
 * nên lớp này chưa được wire trực tiếp.
 * Bạn có thể bỏ qua hoặc dùng sau nếu muốn reindex theo lifecycle.
 */
@Component
@RequiredArgsConstructor
public class EventEmbeddingAutoUpsert {

    private final EmbeddingUpsertService embeddingUpsertService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handle(Event event) {
        if (event == null || event.getId() == null)
            return;
        embeddingUpsertService.upsertEventEmbedding(event);
    }
}
