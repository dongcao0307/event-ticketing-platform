package fit.iuh.event_service.repositories;

import fit.iuh.event_service.models.enums.EventCategory;
import fit.iuh.event_service.models.enums.EventStatus;
import fit.iuh.event_service.models.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional; // 🌟 Thêm import này để chạy @Modifying native query

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // ==================== Các method từ branch feat/login ====================
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
    @Transactional
    @Query("UPDATE Event e SET e.viewCount = e.viewCount + 1 WHERE e.id = :id")
    void incrementViewCount(@Param("id") Long id);

    // ==================== Các method từ branch develop ====================
    List<Event> findByStatus(EventStatus status);
    List<Event> findByOrganizerId(Long organizerId);
    List<Event> findByOrganizerIdAndTitleContainingIgnoreCase(Long organizerId, String title);

    // ==================== TÍNH NĂNG TỰ ĐỘNG ĐỒNG BỘ GIÁ VÉ RA TRANG CHỦ ====================
    /**
     * Tự động quét bảng ticket_types kết hợp với event_performances để tính toán giá thấp nhất (MIN)
     * và giá cao nhất (MAX) của sự kiện, sau đó ghi đè ngược lại vào bảng events (bảng cha).
     * Hàm này sẽ gọi khi Admin bấm nút "Duyệt sự kiện" hoặc khi có bất kỳ thay đổi nào về vé.
     */
    @Modifying
    @Transactional
    @Query(value = "UPDATE events e SET " +
            "e.min_price = (SELECT COALESCE(MIN(t.price), 0) FROM ticket_types t JOIN event_performances p ON t.performance_id = p.id WHERE p.event_id = :eventId), " +
            "e.max_price = (SELECT COALESCE(MAX(t.price), 0) FROM ticket_types t JOIN event_performances p ON t.performance_id = p.id WHERE p.event_id = :eventId) " +
            "WHERE e.id = :eventId", nativeQuery = true)
    void syncPriceOnApproval(@Param("eventId") Long eventId);
}