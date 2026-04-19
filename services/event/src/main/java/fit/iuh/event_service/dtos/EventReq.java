package fit.iuh.event_service.dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class EventReq {
    private String title;
    private String thumbnailUrl;
    private String posterUrl;
    private String description;
    private Long categoryId;

    private String organizerName;
    private String organizerLogo;
    private String organizerInfo;
    private List<FullEventCreateRequest.PerformanceRequest> performances;

    // Thêm các biến này vào EventReq.java
    private String venueName;
    private String province;
    private String district;
    private String ward;
    private String street;
}