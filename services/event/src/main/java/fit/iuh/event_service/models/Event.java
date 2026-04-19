package fit.iuh.event_service.models;

import fit.iuh.event_service.models.enums.EventStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "events")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long organizerId;
    private String title;
    private String thumbnailUrl;
    private String posterUrl;

    @Column(columnDefinition = "TEXT")
    private String description;

    private Long categoryId;

    @Enumerated(EnumType.STRING) // Lưu dưới dạng chuỗi trong DB (DRAFT, PUBLISHED...)
    private EventStatus status;

    private LocalDateTime createdAt;

    @Column(columnDefinition = "TEXT") // Dùng TEXT để lưu chuỗi JSON cho thoải mái
    private String settingsConfig;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<EventPerformance> performances;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    @Column(name = "organizer_name")
    private String organizerName;

    @Column(name = "organizer_logo")
    private String organizerLogo;

    @Column(name = "organizer_info", columnDefinition = "TEXT")
    private String organizerInfo;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id", referencedColumnName = "event_id", insertable = false, updatable = false)
    private OrganizerPaymentInfo paymentInfo;

}