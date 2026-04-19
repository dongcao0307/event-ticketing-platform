package fit.iuh.event_service.repositories;
import fit.iuh.event_service.models.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByOrganizerId(Long organizerId);
    List<Event> findByOrganizerIdAndTitleContainingIgnoreCase(Long organizerId, String title);

}