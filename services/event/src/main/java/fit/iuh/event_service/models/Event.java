package fit.iuh.event_service.models;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fit.iuh.event_service.models.enums.EventCategory;
import fit.iuh.event_service.models.enums.EventStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // Tránh lỗi Proxy của JPA khi parse JSON
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "organizer_id", nullable = false)
    private Long organizerId;

    @Column(name = "category_id", nullable = false)
    private Long categoryId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EventCategory category = EventCategory.OTHER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EventStatus status = EventStatus.DRAFT;

    @Column(columnDefinition = "TEXT")
    private String settingsConfig;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "poster_url")
    private String posterUrl;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "organizer_name", length = 200)
    private String organizerName;

    @Column(name = "organizer_logo", length = 500)
    private String organizerLogo;

    @Column(name = "organizer_info", columnDefinition = "TEXT")
    private String organizerInfo;

    @Column(length = 200)
    private String location;

    @Column(length = 100)
    private String city;

    // --- ĐỊNH DẠNG THỜI GIAN ---
    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "min_price", precision = 15, scale = 0)
    private BigDecimal minPrice;

    @Column(name = "max_price", precision = 15, scale = 0)
    private BigDecimal maxPrice;

    @Column(name = "total_tickets")
    private Integer totalTickets;

    @Column(name = "available_tickets")
    private Integer availableTickets;

    @Column(name = "is_featured")
    @Builder.Default
    private Boolean isFeatured = false;

    @Column(name = "view_count")
    @Builder.Default
    private Integer viewCount = 0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<EventPerformance> performances;

    @OneToOne(mappedBy = "event", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private OrganizerPaymentInfo paymentInfo;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id")
    private Venue venue;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}