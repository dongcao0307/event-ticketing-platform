package fit.iuh.event_service.dtos;

import fit.iuh.event_service.models.enums.EventStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventAdminListDTO {
    private Long id;
    private String title;
    private Long organizerId;
    private String organizerName;
    private String category;
    private String type; // Offline/Online
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime eventDate;
    private String price; // Có phí / Miễn phí
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDateTime createdAt;
    private EventStatus status;
    private Long viewCount;
    private String thumbnailUrl;
}
