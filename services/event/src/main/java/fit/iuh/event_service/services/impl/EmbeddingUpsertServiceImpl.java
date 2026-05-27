package fit.iuh.event_service.services.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import fit.iuh.event_service.models.Event;
import fit.iuh.event_service.models.EventEmbedding;
import fit.iuh.event_service.repositories.EventEmbeddingRepository;
import fit.iuh.event_service.services.EmbeddingService;
import fit.iuh.event_service.services.EmbeddingUpsertService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmbeddingUpsertServiceImpl implements EmbeddingUpsertService {

    private final EmbeddingService embeddingService;
    private final EventEmbeddingRepository embeddingRepository;
    private final ObjectMapper objectMapper;

    @Override
    public void upsertEventEmbedding(Event event) {
        String text = buildEmbeddingText(event);
        double[] vec = embeddingService.embed(text);
        // store as JSON array string to keep it simple & portable for later migration
        String json = objectMapper.valueToTree(vec).toString();

        EventEmbedding embedding = EventEmbedding.builder()
                .eventId(event.getId())
                .embeddingJson(json)
                .updatedAt(LocalDateTime.now())
                .build();

        embeddingRepository.save(embedding);
    }

    private String buildEmbeddingText(Event e) {
        StringBuilder sb = new StringBuilder();
        
        // Tạo ra một đoạn văn bản tự nhiên miêu tả sự kiện để AI dễ hiểu nhất
        sb.append("Sự kiện: ");
        if (e.getTitle() != null) sb.append(e.getTitle()).append(". ");
        
        if (e.getCategory() != null) sb.append("Thể loại: ").append(e.getCategory().name()).append(". ");
        
        if (e.getLocation() != null || e.getCity() != null) {
            sb.append("Địa điểm tổ chức: ");
            if (e.getLocation() != null) sb.append(e.getLocation()).append(", ");
            if (e.getCity() != null) sb.append(e.getCity());
            sb.append(". ");
        }
        
        if (e.getStartTime() != null) sb.append("Thời gian bắt đầu: ").append(e.getStartTime().toString()).append(". ");
        
        if (e.getDescription() != null) sb.append("Mô tả chi tiết: ").append(e.getDescription()).append(". ");
        
        return sb.toString().trim();
    }
}
