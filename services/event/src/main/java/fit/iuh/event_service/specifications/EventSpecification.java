package fit.iuh.event_service.specifications;

import fit.iuh.event_service.models.Event;
import fit.iuh.event_service.models.enums.EventCategory;
import fit.iuh.event_service.models.enums.EventStatus;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * EventSpecification provides dynamic, type-safe filtering for Event entities
 * using JPA Criteria API. All predicates are combined with AND logic.
 * 
 * CRITICAL BUSINESS RULE: Always filters out past events (startTime >= LocalDateTime.now())
 */
public class EventSpecification {

    /**
     * Builds a Specification that filters events by multiple criteria.
     * Always excludes past events.
     *
     * @param keyword         Free-text search on title (case-insensitive LIKE)
     * @param category        Event category (exact match)
     * @param city            City (exact match)
     * @param maxPrice        Maximum price filter (checks minPrice <= maxPrice)
     * @param isFree          If true, filters free events (minPrice = 0 or NULL)
     * @return Specification combining all filters with AND logic
     */
    public static Specification<Event> buildSearchSpec(
            String keyword,
            EventCategory category,
            String city,
            Double maxPrice,
            Boolean isFree) {
        
        return (root, query, cb) -> {
            // Start with the critical business rule: exclude past events
            var predicates = new java.util.ArrayList<jakarta.persistence.criteria.Predicate>();
            predicates.add(cb.greaterThanOrEqualTo(root.get("startTime"), LocalDateTime.now()));
            
            // Only include PUBLISHED events
            predicates.add(cb.equal(root.get("status"), EventStatus.PUBLISHED));
            
            // Apply keyword filter if provided (search in title, case-insensitive)
            if (keyword != null && !keyword.isBlank()) {
                predicates.add(
                    cb.like(
                        cb.lower(root.get("title")),
                        "%" + keyword.toLowerCase() + "%"
                    )
                );
            }
            
            // Apply category filter if provided
            if (category != null) {
                predicates.add(cb.equal(root.get("category"), category));
            }
            
            // Apply city filter if provided (exact match)
            if (city != null && !city.isBlank()) {
                predicates.add(cb.equal(root.get("city"), city));
            }
            
            // Apply price filter if provided
            if (isFree != null && isFree) {
                // Free events: minPrice IS NULL or minPrice = 0
                predicates.add(
                    cb.or(
                        cb.isNull(root.get("minPrice")),
                        cb.equal(root.get("minPrice"), BigDecimal.ZERO)
                    )
                );
            } else if (maxPrice != null && maxPrice > 0) {
                // User provided a maxPrice: filter events where minPrice <= maxPrice
                predicates.add(
                    cb.lessThanOrEqualTo(
                        root.get("minPrice"),
                        BigDecimal.valueOf(maxPrice)
                    )
                );
            }
            
            // Combine all predicates with AND
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };
    }
}
