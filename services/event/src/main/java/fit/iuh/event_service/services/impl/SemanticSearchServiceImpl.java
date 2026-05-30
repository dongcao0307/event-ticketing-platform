package fit.iuh.event_service.services.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import fit.iuh.event_service.dtos.EventResponse;
import fit.iuh.event_service.dtos.PageResponse;
import fit.iuh.event_service.models.Event;
import fit.iuh.event_service.models.EventEmbedding;
import fit.iuh.event_service.models.enums.EventCategory;
import fit.iuh.event_service.models.enums.EventStatus;
import fit.iuh.event_service.repositories.EventEmbeddingRepository;
import fit.iuh.event_service.repositories.EventRepository;
import fit.iuh.event_service.services.EmbeddingService;
import fit.iuh.event_service.services.SemanticSearchService;
import fit.iuh.event_service.services.NerService;
import fit.iuh.event_service.dtos.NerResponse;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

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
    private final NamedParameterJdbcTemplate jdbcTemplate;

    @Override
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
        
        // 1) use NER to extract filters from keyword if not provided
        String cleanedKeyword = keyword;
        if (keyword != null && !keyword.isBlank()) {
            NerResponse nerResponse = nerService.extractEntities(keyword);
            if (nerResponse != null) {
                if ((category == null || category.isBlank()) && nerResponse.getCategory() != null) {
                    category = nerResponse.getCategory();
                }
                if ((city == null || city.isBlank()) && nerResponse.getCity() != null) {
                    city = nerResponse.getCity();
                }
                if (nerResponse.getCleanedKeyword() != null && !nerResponse.getCleanedKeyword().isBlank()) {
                    cleanedKeyword = nerResponse.getCleanedKeyword();
                }
                if (maxPrice == null && nerResponse.getMaxPrice() != null) {
                    maxPrice = nerResponse.getMaxPrice().doubleValue();
                }
            }
        }

        // 2) parse filters
        EventCategory cat = null;
        if (category != null && !category.isBlank()) {
            try {
                cat = EventCategory.valueOf(category.toUpperCase());
            } catch (Exception ignored) {
            }
        }
        EventStatus st = EventStatus.PUBLISHED;

        // 3) Check if we need semantic search (keyword is present)
        boolean hasKeyword = (cleanedKeyword != null && !cleanedKeyword.isBlank());

        // 4) Dynamic native SQL to query only matched candidates
        StringBuilder sql = new StringBuilder();
        sql.append("SELECT e.id, e.title, e.description, e.category, e.city, e.location, e.start_time, e.end_time, e.min_price, e.max_price, e.image_url, e.organizer_name, e.organizer_logo, e.is_featured, e.status, ee.embedding_json ");
        sql.append("FROM events e ");
        if (hasKeyword) {
            sql.append("JOIN event_embeddings ee ON e.id = ee.event_id ");
        } else {
            sql.append("LEFT JOIN event_embeddings ee ON e.id = ee.event_id ");
        }
        sql.append("WHERE e.status = :status ");

        Map<String, Object> params = new HashMap<>();
        params.put("status", st.name());

        if (cat != null) {
            sql.append("AND e.category = :category ");
            params.put("category", cat.name());
        }
        if (city != null && !city.isBlank()) {
            String[] cities = city.split(",");
            List<String> validCities = new ArrayList<>();
            for (String c : cities) {
                String trimmed = c.trim();
                if (!trimmed.isBlank() && !trimmed.toLowerCase().equals("etc") && !trimmed.toLowerCase().equals("etc.")) {
                    validCities.add(trimmed);
                }
            }
            if (!validCities.isEmpty()) {
                sql.append("AND (");
                for (int i = 0; i < validCities.size(); i++) {
                    if (i > 0) {
                        sql.append(" OR ");
                    }
                    sql.append("LOWER(e.city) LIKE LOWER(:city").append(i).append(") ");
                    params.put("city" + i, "%" + validCities.get(i) + "%");
                }
                sql.append(") ");
            }
        }
        if (isFree != null && isFree) {
            sql.append("AND (e.min_price IS NULL OR e.min_price = 0) ");
        } else if (maxPrice != null && maxPrice > 0) {
            sql.append("AND e.min_price <= :maxPrice ");
            params.put("maxPrice", maxPrice);
        }
        if (startDate != null && !startDate.isBlank()) {
            try {
                java.time.LocalDate startD = java.time.LocalDate.parse(startDate);
                sql.append("AND e.start_time >= :startTimeLimit ");
                params.put("startTimeLimit", startD.atStartOfDay());
            } catch (Exception e) {
                // ignore
            }
        }
        if (endDate != null && !endDate.isBlank()) {
            try {
                java.time.LocalDate endD = java.time.LocalDate.parse(endDate);
                sql.append("AND e.start_time <= :endTimeLimit ");
                params.put("endTimeLimit", endD.atTime(23, 59, 59));
            } catch (Exception e) {
                // ignore
            }
        }
        if (location != null && !location.isBlank()) {
            sql.append("AND LOWER(e.location) LIKE LOWER(:location) ");
            params.put("location", "%" + location.trim() + "%");
        }
        if (organizer != null && !organizer.isBlank()) {
            sql.append("AND LOWER(e.organizer_name) LIKE LOWER(:organizer) ");
            params.put("organizer", "%" + organizer.trim() + "%");
        }

        List<EventCandidate> candidates = jdbcTemplate.query(sql.toString(), params, (rs, rowNum) -> {
            EventCandidate ec = new EventCandidate();
            ec.setId(rs.getLong("id"));
            ec.setTitle(rs.getString("title"));
            ec.setDescription(rs.getString("description"));
            ec.setCategory(rs.getString("category"));
            ec.setCity(rs.getString("city"));
            ec.setLocation(rs.getString("location"));
            ec.setStartTime(rs.getTimestamp("start_time") != null ? rs.getTimestamp("start_time").toLocalDateTime() : null);
            ec.setEndTime(rs.getTimestamp("end_time") != null ? rs.getTimestamp("end_time").toLocalDateTime() : null);
            ec.setMinPrice(rs.getBigDecimal("min_price"));
            ec.setMaxPrice(rs.getBigDecimal("max_price"));
            ec.setImageUrl(rs.getString("image_url"));
            ec.setOrganizerName(rs.getString("organizer_name"));
            ec.setOrganizerLogo(rs.getString("organizer_logo"));
            ec.setIsFeatured(rs.getBoolean("is_featured"));
            ec.setStatus(rs.getString("status"));
            ec.setEmbeddingJson(rs.getString("embedding_json"));
            return ec;
        });

        if (candidates.isEmpty()) {
            return List.of();
        }

        List<Long> topIds = new ArrayList<>();

        if (hasKeyword) {
            // 3) embed query (using cleaned keyword)
            double[] queryEmbedding = embeddingService.embed(cleanedKeyword);

            // 5) calculate similarity
            record Scored(long eventId, double score) {
            }
            List<Scored> scored = new ArrayList<>();
            for (EventCandidate ec : candidates) {
                String json = ec.getEmbeddingJson();
                if (json == null || json.isBlank())
                    continue;
                try {
                    double[] vec = objectMapper.convertValue(objectMapper.readTree(json), double[].class);
                    double score = cosineSimilarity(queryEmbedding, vec);
                    scored.add(new Scored(ec.getId(), score));
                } catch (Exception ex) {
                    // Skip invalid stored embeddings
                }
            }

            scored.sort((a, b) -> Double.compare(b.score(), a.score()));
            if (scored.isEmpty())
                return List.of();

            int from = page * size;
            int to = Math.min(scored.size(), from + size);
            if (from >= scored.size())
                return List.of();

            topIds = scored.subList(from, to).stream().map(Scored::eventId).toList();
        } else {
            // Sort by isFeatured DESC, startTime ASC by default
            candidates.sort((a, b) -> {
                int featCompare = Boolean.compare(b.getIsFeatured(), a.getIsFeatured());
                if (featCompare != 0) {
                    return featCompare;
                }
                if (a.getStartTime() == null && b.getStartTime() == null) return 0;
                if (a.getStartTime() == null) return 1;
                if (b.getStartTime() == null) return -1;
                return a.getStartTime().compareTo(b.getStartTime());
            });

            int from = page * size;
            int to = Math.min(candidates.size(), from + size);
            if (from >= candidates.size())
                return List.of();

            topIds = candidates.subList(from, to).stream().map(EventCandidate::getId).toList();
        }

        // 6) load final events by ids preserving order
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
