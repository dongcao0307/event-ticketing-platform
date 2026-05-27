package fit.iuh.event_service.repositories;

import fit.iuh.event_service.models.EventEmbedding;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventEmbeddingRepository extends JpaRepository<EventEmbedding, Long> {
}
