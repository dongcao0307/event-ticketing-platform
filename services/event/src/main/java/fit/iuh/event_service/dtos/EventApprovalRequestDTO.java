package fit.iuh.event_service.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventApprovalRequestDTO {
    private Long eventId;
    private String action; // APPROVE, REJECT, LOCK
    private String reason; // Để lại lý do từ chối/khóa
}
