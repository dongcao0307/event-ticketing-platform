package fit.iuh.event_service.dtos;

// 1. IMPORT CÁC THƯ VIỆN CẦN THIẾT
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import fit.iuh.event_service.models.enums.EventStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventSummaryResponse {
    private Long id;
    private String title;
    private String thumbnailUrl;

    // 2. ỐP BÙA CHO BIẾN NGÀY THÁNG
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createdAt;

    private EventStatus status;
    private String venueName;
    private String fullAddress;
    private String organizerName;
    private String organizerLogo;
    private String organizerInfo;
}