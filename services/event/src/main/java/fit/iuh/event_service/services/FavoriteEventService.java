package fit.iuh.event_service.services;

import fit.iuh.event_service.dtos.EventResponse;
import fit.iuh.event_service.models.FavoriteEvent;
import fit.iuh.event_service.models.Event;
import fit.iuh.event_service.repositories.FavoriteEventRepository;
import fit.iuh.event_service.repositories.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class FavoriteEventService {

    private final FavoriteEventRepository favoriteEventRepository;
    private final EventRepository eventRepository;
    private final JdbcTemplate jdbcTemplate;

    /**
     * Resolve userId from email using native SQL query on shared database
     */
    private Long resolveUserId(String email) {
        String sql = "SELECT u.id FROM users u JOIN accounts a ON u.account_user_name = a.user_name WHERE a.email = ?";
        try {
            return jdbcTemplate.queryForObject(sql, Long.class, email);
        } catch (EmptyResultDataAccessException e) {
            log.error("Could not find userId for email: {}", email);
            throw new RuntimeException("Không tìm thấy tài khoản người dùng: " + email);
        }
    }

    /**
     * Toggle favorite status of an event for a user
     * Returns true if favorited, false if unfavorited
     */
    public boolean toggleFavorite(String email, Long eventId) {
        Long userId = resolveUserId(email);
        log.info("Toggling favorite for userId: {} and eventId: {}", userId, eventId);

        // Check if event exists
        if (!eventRepository.existsById(eventId)) {
            throw new RuntimeException("Sự kiện không tồn tại");
        }

        Optional<FavoriteEvent> existing = favoriteEventRepository.findByUserIdAndEventId(userId, eventId);
        if (existing.isPresent()) {
            favoriteEventRepository.delete(existing.get());
            log.info("Removed event {} from favorites for user {}", eventId, userId);
            return false;
        } else {
            FavoriteEvent favoriteEvent = FavoriteEvent.builder()
                    .userId(userId)
                    .eventId(eventId)
                    .build();
            favoriteEventRepository.save(favoriteEvent);
            log.info("Added event {} to favorites for user {}", eventId, userId);
            return true;
        }
    }

    /**
     * Get list of favorite events for a user
     */
    @Transactional(readOnly = true)
    public List<EventResponse> getFavoriteEvents(String email) {
        Long userId = resolveUserId(email);
        log.info("Getting favorite events for userId: {}", userId);

        List<Event> favorites = eventRepository.findFavoriteEventsByUserId(userId);
        return favorites.stream()
                .map(EventResponse::fromEntity)
                .toList();
    }

    /**
     * Check if a specific event is favorited by the user
     */
    @Transactional(readOnly = true)
    public boolean isFavorited(String email, Long eventId) {
        Long userId = resolveUserId(email);
        return favoriteEventRepository.existsByUserIdAndEventId(userId, eventId);
    }
}
