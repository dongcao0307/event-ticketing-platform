package fit.iuh.event_service.repositories;

import fit.iuh.event_service.models.FavoriteEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteEventRepository extends JpaRepository<FavoriteEvent, Long> {
    Optional<FavoriteEvent> findByUserIdAndEventId(Long userId, Long eventId);
    List<FavoriteEvent> findByUserId(Long userId);
    boolean existsByUserIdAndEventId(Long userId, Long eventId);
    void deleteByUserIdAndEventId(Long userId, Long eventId);
}
