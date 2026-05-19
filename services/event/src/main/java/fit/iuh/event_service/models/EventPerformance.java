package fit.iuh.event_service.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fit.iuh.event_service.models.enums.PerformanceStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "event_performances")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class EventPerformance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    @JsonIgnore // Ngắt vòng lặp Event -> Performance -> Event
    private Event event;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "venue_id")
    private Venue venue;

    // --- ĐỊNH DẠNG THỜI GIAN ---
    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "total_capacity")
    private Integer totalCapacity;

    @Column(name = "available_capacity")
    private Integer availableCapacity;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private PerformanceStatus status;

    @Builder.Default
    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "performance_id", referencedColumnName = "id", insertable = false, updatable = false)
    private List<TicketType> tickets = new ArrayList<>();
}