package fit.iuh.booking_service.mappers;

import fit.iuh.event_service.grpc.generated.EventPerformanceDto;
import fit.iuh.event_service.grpc.generated.EventDto;
import fit.iuh.event_service.grpc.generated.VenueDto;
import fit.iuh.booking_service.dtos.responses.EventDetailDto;
import fit.iuh.booking_service.dtos.responses.EventPerformanceDetailDto;
import fit.iuh.booking_service.dtos.responses.VenueDetailDto;
import org.springframework.stereotype.Component;

/**
 * Mapper for converting gRPC response DTOs to booking service DTOs.
 */
@Component
public class EventGrpcMapper {

    public EventDetailDto toEventDetailDto(EventDto eventDto) {
        if (eventDto == null) {
            return null;
        }

        return EventDetailDto.builder()
                .id(eventDto.getId())
                .title(eventDto.getTitle())
                .description(eventDto.getDescription())
                .status(eventDto.getStatus())
                .venue(toVenueDetailDto(eventDto.getVenue()))
                .build();
    }

    public VenueDetailDto toVenueDetailDto(VenueDto venueDto) {
        if (venueDto == null) {
            return null;
        }

        return VenueDetailDto.builder()
                .id(venueDto.getId())
                .name(venueDto.getName())
                .address(venueDto.getAddress())
                .build();
    }

    public EventPerformanceDetailDto toEventPerformanceDetailDto(EventPerformanceDto performanceDto) {
        if (performanceDto == null) {
            return null;
        }

        return EventPerformanceDetailDto.builder()
                .id(performanceDto.getId())
                .startTime(performanceDto.getStartTime())
                .endTime(performanceDto.getEndTime())
                .status(performanceDto.getStatus())
                .build();
    }
}
