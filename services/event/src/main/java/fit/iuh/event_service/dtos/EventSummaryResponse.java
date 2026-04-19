package fit.iuh.event_service.dtos;

import fit.iuh.event_service.models.enums.EventStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventSummaryResponse {
    private Long id;
    private String title;
    private String thumbnailUrl;
    private LocalDateTime createdAt;
    private EventStatus status;
    private String venueName;
    private String fullAddress;
    private String organizerName;
    private String organizerLogo;
    private String organizerInfo;// Trường này để gửi chuỗi địa chỉ hoàn chỉnh xuống React
}