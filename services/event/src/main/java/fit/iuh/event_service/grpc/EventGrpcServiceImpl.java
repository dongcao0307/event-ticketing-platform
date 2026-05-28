package fit.iuh.event_service.grpc;

import fit.iuh.event_service.grpc.generated.*;
import fit.iuh.event_service.models.Event;
import fit.iuh.event_service.models.EventPerformance;
import fit.iuh.event_service.models.TicketType;
import fit.iuh.event_service.repositories.EventPerformanceRepository;
import fit.iuh.event_service.repositories.TicketTypeRepository;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * gRPC Service implementation for Event operations.
 * Handles requests from booking-service to fetch event details via gRPC.
 */
@Slf4j
@GrpcService
@RequiredArgsConstructor
public class EventGrpcServiceImpl extends EventGrpcServiceGrpc.EventGrpcServiceImplBase {

    private final TicketTypeRepository ticketTypeRepository;
    private final EventPerformanceRepository eventPerformanceRepository;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    /**
     * RPC method to get Event and EventPerformance details by Ticket Type ID.
     * This method fetches all necessary information for booking validation.
     * 
     * @Transactional is required because EventPerformance.event is LAZY loaded
     * and we need to access it before Hibernate session closes.
     */
    @Override
    @Transactional(readOnly = true)
    public void getEventAndPerformanceByTicketType(
            GetEventAndPerformanceRequest request,
            StreamObserver<GetEventAndPerformanceResponse> responseObserver) {

        try {
            long ticketTypeId = request.getTicketTypeId();
            log.info("Received gRPC request for ticketTypeId: {}", ticketTypeId);

            // 1. Find the TicketType
            TicketType ticketType = ticketTypeRepository.findById(ticketTypeId)
                    .orElseThrow(() -> new RuntimeException("TicketType not found: " + ticketTypeId));

            // 2. Find the EventPerformance using performanceId from TicketType
            EventPerformance performance = eventPerformanceRepository.findById(ticketType.getPerformanceId())
                    .orElseThrow(() -> new RuntimeException("EventPerformance not found: " + ticketType.getPerformanceId()));

            // 3. Get Event from EventPerformance
            Event event = performance.getEvent();
            if (event == null) {
                throw new RuntimeException("Event not found for performance: " + performance.getId());
            }

            // 4. Get all TicketTypes for this performance
            List<TicketType> allTicketTypes = ticketTypeRepository.findAll().stream()
                    .filter(tt -> tt.getPerformanceId().equals(performance.getId()))
                    .toList();

            // 5. Build response DTOs
            EventDto eventDto = buildEventDto(event);
            EventPerformanceDto performanceDto = buildPerformanceDto(performance);
            List<TicketTypeDto> ticketTypesDto = buildTicketTypeDtos(allTicketTypes);

            GetEventAndPerformanceResponse response = GetEventAndPerformanceResponse.newBuilder()
                    .setEvent(eventDto)
                    .setEventPerformance(performanceDto)
                    .addAllTicketTypes(ticketTypesDto)
                    .build();

            log.info("Successfully retrieved event details for ticketTypeId: {}", ticketTypeId);
            responseObserver.onNext(response);
            responseObserver.onCompleted();

        } catch (Exception e) {
            log.error("Error processing gRPC request", e);
            responseObserver.onError(
                    io.grpc.Status.INTERNAL
                            .withDescription("Error fetching event details: " + e.getMessage())
                            .asException()
            );
        }
    }

    /**
     * Build EventDto from Event entity.
     */
    private EventDto buildEventDto(Event event) {
        EventDto.Builder builder = EventDto.newBuilder()
                .setId(event.getId())
                .setTitle(event.getTitle() != null ? event.getTitle() : "")
                .setDescription(event.getDescription() != null ? event.getDescription() : "")
                .setStatus(event.getStatus() != null ? event.getStatus().toString() : "")
                .setCategory(event.getCategory() != null ? event.getCategory().toString() : "");

        // Build Venue
        if (event.getVenue() != null) {
            VenueDto venueDto = VenueDto.newBuilder()
                    .setId(event.getVenue().getId())
                    .setName(event.getVenue().getName() != null ? event.getVenue().getName() : "")
                    .setAddress(event.getVenue().getAddress() != null ? event.getVenue().getAddress() : "")
                    .build();
            builder.setVenue(venueDto);
        }

        return builder.build();
    }

    /**
     * Build EventPerformanceDto from EventPerformance entity.
     */
    private EventPerformanceDto buildPerformanceDto(EventPerformance performance) {
        return EventPerformanceDto.newBuilder()
                .setId(performance.getId())
                .setStartTime(performance.getStartTime() != null ? performance.getStartTime().format(FORMATTER) : "")
                .setEndTime(performance.getEndTime() != null ? performance.getEndTime().format(FORMATTER) : "")
                .setStatus(performance.getStatus() != null ? performance.getStatus().toString() : "")
                .build();
    }

    /**
     * Build TicketTypeDtos from TicketType entities.
     */
    private List<TicketTypeDto> buildTicketTypeDtos(List<TicketType> ticketTypes) {
        return ticketTypes.stream()
                .map(tt -> TicketTypeDto.newBuilder()
                        .setId(tt.getId())
                        .setName(tt.getName() != null ? tt.getName() : "")
                        .setPrice(tt.getPrice() != null ? tt.getPrice().doubleValue() : 0.0)
                        .setQuantity(tt.getTotalQuantity() != null ? tt.getTotalQuantity() : 0)
                        .setAvailableQuantity(calculateAvailableQuantity(tt))
                        .setSaleEnd(tt.getSaleEnd() != null ? tt.getSaleEnd().format(FORMATTER) : "")
                        .setMinTicketsPerUser(tt.getMinTicketsPerUser() != null ? tt.getMinTicketsPerUser() : 0)
                        .setMaxTicketsPerUser(tt.getMaxTicketsPerUser() != null ? tt.getMaxTicketsPerUser() : 0)
                        .build()
                )
                .toList();
    }

    /**
     * Calculate available quantity = total - sold - reserved.
     */
    private int calculateAvailableQuantity(TicketType ticketType) {
        int total = ticketType.getTotalQuantity() != null ? ticketType.getTotalQuantity() : 0;
        int sold = ticketType.getSoldQuantity() != null ? ticketType.getSoldQuantity() : 0;
        int reserved = ticketType.getReservedQuantity() != null ? ticketType.getReservedQuantity() : 0;
        return Math.max(0, total - sold - reserved);
    }
}
