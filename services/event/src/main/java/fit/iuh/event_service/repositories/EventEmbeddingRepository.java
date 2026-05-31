package fit.iuh.event_service.repositories;

import fit.iuh.event_service.models.EventEmbedding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EventEmbeddingRepository extends JpaRepository<EventEmbedding, Long> {
    Optional<EventEmbedding> findByEventId(Long eventId);
}
