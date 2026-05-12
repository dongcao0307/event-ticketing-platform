package fit.iuh.booking_service.dtos.responses;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventDetailDto {
    private Long id;
    private String title;
    private String description;
    private String status;
    private String category;
    private VenueDetailDto venue;
}
