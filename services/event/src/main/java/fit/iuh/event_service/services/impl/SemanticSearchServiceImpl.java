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
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class SemanticSearchServiceImpl implements SemanticSearchService {

    private final EmbeddingService embeddingService;
    private final EventRepository eventRepository;
    private final EventEmbeddingRepository embeddingRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<EventResponse> search(String keyword, String category, String city, String status, int page, int size) {
        // 1) parse filters
        EventCategory cat = null;
        if (category != null && !category.isBlank()) {
            try {
                cat = EventCategory.valueOf(category.toUpperCase());
            } catch (Exception ignored) {
            }
        }
        EventStatus st = null;
        if (status != null && !status.isBlank()) {
            try {
                st = EventStatus.valueOf(status.toUpperCase());
            } catch (Exception ignored) {
            }
        }

        // 2) embed query
        double[] queryEmbedding = embeddingService.embed(keyword);

        // 3) candidates: reuse keyword repository filtering by forcing keyword null.
        // We'll build a quick candidate list using existing JPA query by setting
        // keyword=null.
        // (This is still hybrid: DB filters first, semantic second.)
        int maxCandidates = 5000;
        var pageable = PageRequest.of(0, maxCandidates);
        var candidatePage = eventRepository.searchEvents(
                null,
                cat,
                city != null && !city.isBlank() ? city : null,
                st,
                pageable);

        List<Event> candidates = candidatePage.getContent();
        if (candidates.isEmpty())
            return List.of();

        // 4) load embeddings for candidates
        // (batch not implemented; MVP loads one-by-one; can optimize later)
        Map<Long, double[]> embeddingMap = new HashMap<>();
        for (Event e : candidates) {
            Optional<EventEmbedding> embOpt = embeddingRepository.findById(e.getId());
            if (embOpt.isEmpty())
                continue;
            String json = embOpt.get().getEmbeddingJson();
            try {
                double[] vec = objectMapper.convertValue(objectMapper.readTree(json), double[].class);
                embeddingMap.put(e.getId(), vec);
            } catch (com.fasterxml.jackson.core.JsonProcessingException ex) {
                // Skip invalid stored embeddings
                // (MVP: keep search resilient)
                continue;
            }
        }

        // 5) cosine similarity + topK
        record Scored(long eventId, double score) {
        }
        List<Scored> scored = new ArrayList<>();
        for (Event e : candidates) {
            double[] ev = embeddingMap.get(e.getId());
            if (ev == null)
                continue;
            double score = cosineSimilarity(queryEmbedding, ev);
            scored.add(new Scored(e.getId(), score));
        }

        scored.sort((a, b) -> Double.compare(b.score(), a.score()));
        if (scored.isEmpty())
            return List.of();

        int from = page * size;
        int to = Math.min(scored.size(), from + size);
        if (from >= scored.size())
            return List.of();

        List<Long> topIds = scored.subList(from, to).stream().map(Scored::eventId).toList();
        // 6) load final events by ids preserving order (MVP)
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
}
