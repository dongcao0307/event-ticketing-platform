package fit.iuh.event_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "event_performances")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventPerformance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long eventId;

    @Column(nullable = false)
    private Long venueId;

    @Column(nullable = false)
    private Long startTime;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = false)
    private Integer totalCapacity;

    @Column(nullable = false)
    private Integer availableCapacity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PerformanceStatus status;
}
