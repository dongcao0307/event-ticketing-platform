package fit.iuh.booking_service.dtos.responses;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventPerformanceDetailDto {
    private Long id;
    private String startTime;
    private String endTime;
    private String status;
}
