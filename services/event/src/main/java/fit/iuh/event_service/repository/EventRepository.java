package fit.iuh.event_service.repository;

import fit.iuh.event_service.entity.Event;
import fit.iuh.event_service.entity.enums.EventCategory;
import fit.iuh.event_service.entity.enums.EventStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {

    @Query("SELECT e FROM Event e WHERE " +
           "(:keyword IS NULL OR LOWER(e.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(e.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:category IS NULL OR e.category = :category) AND " +
           "(:city IS NULL OR LOWER(e.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "(:status IS NULL OR e.status = :status) " +
           "ORDER BY e.isFeatured DESC, e.startTime ASC")
    Page<Event> searchEvents(
            @Param("keyword") String keyword,
            @Param("category") EventCategory category,
            @Param("city") String city,
            @Param("status") EventStatus status,
            Pageable pageable
    );

    List<Event> findByIsFeaturedTrueOrderByStartTimeAsc();

    List<Event> findTop10ByOrderByViewCountDesc();

    List<Event> findTop10ByOrderByCreatedAtDesc();

    List<Event> findByCategoryOrderByStartTimeAsc(EventCategory category);

    @Modifying
    @Query("UPDATE Event e SET e.viewCount = e.viewCount + 1 WHERE e.id = :id")
    void incrementViewCount(@Param("id") Long id);
}
