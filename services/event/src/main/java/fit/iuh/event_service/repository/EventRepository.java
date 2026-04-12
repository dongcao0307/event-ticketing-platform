package fit.iuh.event_service.repository;

import fit.iuh.event_service.entity.Event;
import fit.iuh.event_service.entity.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByStatus(EventStatus status);
    List<Event> findByOrganizerId(Long organizerId);
    Optional<Event> findByIdAndStatus(Long id, EventStatus status);
}
