package fit.iuh.event_service.repositories.mongo;

import fit.iuh.event_service.models.EventDocument;
import fit.iuh.event_service.models.enums.EventCategory;
import fit.iuh.event_service.models.enums.EventStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventDocumentRepository extends MongoRepository<EventDocument, String> {
    List<EventDocument> findByOrganizerId(Long organizerId);

    @Query("{ '$or': [ { 'title': { $regex: ?0, $options: 'i' } }, { 'description': { $regex: ?0, $options: 'i' } } ] }")
    List<EventDocument> searchByKeyword(String keyword);

    List<EventDocument> findByIsFeaturedTrueAndStatusOrderByStartTimeAsc(EventStatus status);

    List<EventDocument> findByCategoryAndStatusOrderByStartTimeAsc(EventCategory category, EventStatus status);

    List<EventDocument> findTop10ByStatusOrderByViewCountDesc(EventStatus status);

    List<EventDocument> findTop10ByStatusOrderByCreatedAtDesc(EventStatus status);
}
