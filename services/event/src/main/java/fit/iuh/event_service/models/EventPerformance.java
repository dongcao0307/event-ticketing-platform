package fit.iuh.event_service.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import fit.iuh.event_service.models.enums.PerformanceStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "event_performances")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EventPerformance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Mapping khóa ngoại sang Event
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    @JsonIgnore
    private Event event;

    // Mapping khóa ngoại sang Venue
    @ManyToOne(fetch = FetchType.EAGER) // Thường lấy suất diễn sẽ muốn biết diễn ở đâu luôn
    @JoinColumn(name = "venue_id")
    private Venue venue;

    private LocalDateTime startTime; // Đã đồng bộ thành LocalDateTime thay vì Long
    private LocalDateTime endTime;

    private Integer totalCapacity;
    private Integer availableCapacity;

    @Enumerated(EnumType.STRING)
    private PerformanceStatus status;

    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "performance_id", referencedColumnName = "id", insertable = false, updatable = false)
    private List<TicketType> tickets = new ArrayList<>();
}