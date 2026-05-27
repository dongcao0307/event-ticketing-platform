package fit.iuh.event_service.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "event_embeddings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventEmbedding {

    @Id
    @Column(name = "event_id")
    private Long eventId;

    @Lob
    @Column(name = "embedding_json", nullable = false, columnDefinition = "MEDIUMTEXT")
    private String embeddingJson;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    public void touchUpdatedAt() {
        if (updatedAt == null)
            updatedAt = LocalDateTime.now();
        else
            updatedAt = LocalDateTime.now();
    }
}
