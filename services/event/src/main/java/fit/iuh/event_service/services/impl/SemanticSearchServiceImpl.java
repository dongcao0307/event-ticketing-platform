package fit.iuh.event_service.services.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import fit.iuh.event_service.dtos.EventResponse;
import fit.iuh.event_service.models.Event;
import fit.iuh.event_service.models.EventEmbedding;
import fit.iuh.event_service.models.enums.EventCategory;
import fit.iuh.event_service.repositories.EventEmbeddingRepository;
import fit.iuh.event_service.repositories.EventRepository;
import fit.iuh.event_service.services.EmbeddingService;
import fit.iuh.event_service.services.SemanticSearchService;
import fit.iuh.event_service.services.NerService;
import fit.iuh.event_service.dtos.NerResponse;
import fit.iuh.event_service.specifications.EventSpecification;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class SemanticSearchServiceImpl implements SemanticSearchService {

    private final EmbeddingService embeddingService;
    private final EventRepository eventRepository;
    private final EventEmbeddingRepository embeddingRepository;
    private final ObjectMapper objectMapper;
    private final NerService nerService;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "ai_event_searches", key = "{#keyword, #city, #maxPrice, #category}")
    public List<EventResponse> search(
            String keyword,
            String category,
            String city,
            String status,
            Double maxPrice,
            Boolean isFree,
            String startDate,
            String endDate,
            String location,
            String organizer,
            int page,
            int size) {
        
        // 1) Use NER to extract filters from keyword if not provided
        String cleanedKeyword = keyword;
        if (keyword != null && !keyword.isBlank()) {
            NerResponse nerResponse = nerService.extractEntities(keyword);
            if (nerResponse != null) {
                boolean hasAnyFilter = nerResponse.getCategory() != null 
                        || nerResponse.getCity() != null 
                        || nerResponse.getMaxPrice() != null;

                if ((category == null || category.isBlank()) && nerResponse.getCategory() != null) {
                    category = nerResponse.getCategory();
                }
                if ((city == null || city.isBlank()) && nerResponse.getCity() != null) {
                    city = nerResponse.getCity();
                }
                if (maxPrice == null && nerResponse.getMaxPrice() != null) {
                    maxPrice = nerResponse.getMaxPrice().doubleValue();
                }

                // If NER successfully extracted filters, use its cleanedKeyword (even if empty)
                if (hasAnyFilter) {
                    cleanedKeyword = nerResponse.getCleanedKeyword();
                } else if (nerResponse.getCleanedKeyword() != null && !nerResponse.getCleanedKeyword().isBlank()) {
                    cleanedKeyword = nerResponse.getCleanedKeyword();
                }
            }
        }

        // 2) Parse filters to enums
        EventCategory cat = null;
        if (category != null && !category.isBlank()) {
            try {
                cat = EventCategory.valueOf(category.toUpperCase());
            } catch (Exception ignored) {
            }
        }

        // 3) Check if we need semantic search (keyword is present)
        boolean hasKeyword = (cleanedKeyword != null && !cleanedKeyword.isBlank());

        // 4) Build Specification using EventSpecification utility (auto-excludes past events)
        // If performing semantic search, do not apply strict SQL LIKE title check on candidates.
        Specification<Event> spec = EventSpecification.buildSearchSpec(
                hasKeyword ? null : cleanedKeyword, 
                cat, 
                city, 
                maxPrice, 
                isFree
        );

        // 5) Handle date range filtering within spec (add date constraints if provided)
        spec = addDateRangeToSpec(spec, startDate, endDate);

        // 6) Add location and organizer filters if provided
        spec = addLocationAndOrganizerToSpec(spec, location, organizer);

        // 7) Fetch events with Specification (eliminates N+1 via @EntityGraph on EventRepository)
        // Sort by isFeatured DESC, startTime ASC
        Sort sort = Sort.by(Sort.Order.desc("isFeatured"), Sort.Order.asc("startTime"));
        List<Event> candidates = eventRepository.findAll(spec, sort);

        if (candidates.isEmpty()) {
            return new ArrayList<>();
        }

        List<Long> topIds = new ArrayList<>();

        if (hasKeyword) {
            // 8) Perform semantic similarity search using embeddings
            double[] queryEmbedding = embeddingService.embed(cleanedKeyword);

            record Scored(long eventId, double score) {
            }
            List<Scored> scored = new ArrayList<>();
            
            for (Event event : candidates) {
                EventEmbedding embedding = embeddingRepository.findByEventId(event.getId()).orElse(null);
                if (embedding == null || embedding.getEmbeddingJson() == null || embedding.getEmbeddingJson().isBlank())
                    continue;
                try {
                    double[] vec = objectMapper.convertValue(objectMapper.readTree(embedding.getEmbeddingJson()), double[].class);
                    double score = cosineSimilarity(queryEmbedding, vec);
                    scored.add(new Scored(event.getId(), score));
                } catch (Exception ex) {
                    // Skip invalid stored embeddings
                }
            }

            scored.sort((a, b) -> Double.compare(b.score(), a.score()));
            if (scored.isEmpty())
                return new ArrayList<>();

            int from = page * size;
            int to = Math.min(scored.size(), from + size);
            if (from >= scored.size())
                return new ArrayList<>();

            topIds = scored.subList(from, to).stream().map(Scored::eventId).toList();
        } else {
            // No keyword: return paginated results sorted by featured DESC, startTime ASC
            int from = page * size;
            int to = Math.min(candidates.size(), from + size);
            if (from >= candidates.size())
                return new ArrayList<>();

            topIds = candidates.subList(from, to).stream().map(Event::getId).toList();
        }

        // 9) Map events to EventResponse DTOs (order preserved)
        Map<Long, Event> byId = new HashMap<>();
        eventRepository.findAllById(topIds).forEach(e -> byId.put(e.getId(), e));

        List<EventResponse> result = new ArrayList<>();
        for (Long id : topIds) {
            Event ev = byId.get(id);
            if (ev != null)
                result.add(EventResponse.fromEntity(ev));
        }
        return result;
    }

    /**
     * Adds date range constraints to the Specification.
     */
    private Specification<Event> addDateRangeToSpec(Specification<Event> spec, String startDate, String endDate) {
        java.time.LocalDate startD = null;
        java.time.LocalDate endD = null;
        
        if (startDate != null && !startDate.isBlank()) {
            try {
                startD = java.time.LocalDate.parse(startDate);
            } catch (Exception ignored) {
            }
        }
        
        if (endDate != null && !endDate.isBlank()) {
            try {
                endD = java.time.LocalDate.parse(endDate);
            } catch (Exception ignored) {
            }
        }
        
        if (startD != null || endD != null) {
            // Create effectively final copies for use in lambda
            final java.time.LocalDate finalStartD = startD;
            final java.time.LocalDate finalEndD = endD;
            
            Specification<Event> dateSpec = (root, query, cb) -> {
                if (finalStartD != null && finalEndD == null) {
                    // Only startDate: search for events on that entire day
                    return cb.between(
                        root.get("startTime"),
                        finalStartD.atStartOfDay(),
                        finalStartD.atTime(java.time.LocalTime.MAX)
                    );
                } else if (finalStartD != null && finalEndD != null) {
                    // Both dates: search between startDate 00:00:00 and endDate 23:59:59
                    return cb.between(
                        root.get("startTime"),
                        finalStartD.atStartOfDay(),
                        finalEndD.atTime(java.time.LocalTime.MAX)
                    );
                } else if (finalStartD == null && finalEndD != null) {
                    // Only endDate: search for events up to end of that day
                    return cb.lessThanOrEqualTo(
                        root.get("startTime"),
                        finalEndD.atTime(java.time.LocalTime.MAX)
                    );
                }
                return null;
            };
            return spec.and(dateSpec);
        }
        return spec;
    }

    /**
     * Adds location and organizer filters to the Specification.
     */
    private Specification<Event> addLocationAndOrganizerToSpec(Specification<Event> spec, String location, String organizer) {
        Specification<Event> additionalSpec = Specification.where(null);
        
        if (location != null && !location.isBlank()) {
            additionalSpec = additionalSpec.and((root, query, cb) ->
                cb.like(
                    cb.lower(root.get("location")),
                    "%" + location.toLowerCase() + "%"
                )
            );
        }
        
        if (organizer != null && !organizer.isBlank()) {
            additionalSpec = additionalSpec.and((root, query, cb) ->
                cb.like(
                    cb.lower(root.get("organizerName")),
                    "%" + organizer.toLowerCase() + "%"
                )
            );
        }
        
        return spec.and(additionalSpec);
    }

    private double cosineSimilarity(double[] a, double[] b) {
        if (a == null || b == null || a.length != b.length)
            return -1.0;
        double dot = 0.0, normA = 0.0, normB = 0.0;
        for (int i = 0; i < a.length; i++) {
            dot += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }
        double denom = Math.sqrt(normA) * Math.sqrt(normB);
        if (denom == 0)
            return -1.0;
        return dot / denom;
    }

    @Data
    private static class EventCandidate {
        private Long id;
        private String title;
        private String description;
        private String category;
        private String city;
        private String location;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private BigDecimal minPrice;
        private BigDecimal maxPrice;
        private String imageUrl;
        private String organizerName;
        private String organizerLogo;
        private Boolean isFeatured;
        private String status;
        private String embeddingJson;
    }
}
