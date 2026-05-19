package fit.iuh.booking_service.dtos.responses;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VenueDetailDto {
    private Long id;
    private String name;
    private String address;
}
