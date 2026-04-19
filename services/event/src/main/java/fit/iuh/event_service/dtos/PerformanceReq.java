package fit.iuh.event_service.dtos;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter @Setter
public class PerformanceReq {
    private Long venueId; // Khi tạo suất diễn NTC phải chọn địa điểm
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer totalCapacity;
}