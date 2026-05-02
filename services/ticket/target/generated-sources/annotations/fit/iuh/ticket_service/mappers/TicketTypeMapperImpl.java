package fit.iuh.ticket_service.mappers;

import fit.iuh.ticket_service.dtos.requests.TicketTypeCreateRequest;
import fit.iuh.ticket_service.dtos.requests.TicketTypeUpdateRequest;
import fit.iuh.ticket_service.dtos.responses.TicketTypeResponse;
import fit.iuh.ticket_service.entities.TicketType;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-18T22:44:34+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class TicketTypeMapperImpl implements TicketTypeMapper {

    @Override
    public TicketType toTicketType(TicketTypeCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        TicketType.TicketTypeBuilder ticketType = TicketType.builder();

        ticketType.maxTicketsPerUser( request.getMaxTicketsPerUser() );
        ticketType.name( request.getName() );
        ticketType.performanceId( request.getPerformanceId() );
        ticketType.price( request.getPrice() );
        ticketType.totalQuantity( request.getTotalQuantity() );
        ticketType.version( request.getVersion() );

        ticketType.reservedQuantity( 0 );
        ticketType.soldQuantity( 0 );

        return ticketType.build();
    }

    @Override
    public void updateTicketType(TicketTypeUpdateRequest request, TicketType ticketType) {
        if ( request == null ) {
            return;
        }

        ticketType.setMaxTicketsPerUser( request.getMaxTicketsPerUser() );
        ticketType.setName( request.getName() );
        ticketType.setPrice( request.getPrice() );
        ticketType.setReservedQuantity( request.getReservedQuantity() );
        ticketType.setSoldQuantity( request.getSoldQuantity() );
        ticketType.setTotalQuantity( request.getTotalQuantity() );
        ticketType.setVersion( request.getVersion() );
    }

    @Override
    public TicketTypeResponse toTicketTypeResponse(TicketType ticketType) {
        if ( ticketType == null ) {
            return null;
        }

        TicketTypeResponse ticketTypeResponse = new TicketTypeResponse();

        ticketTypeResponse.setId( ticketType.getId() );
        ticketTypeResponse.setMaxTicketsPerUser( ticketType.getMaxTicketsPerUser() );
        ticketTypeResponse.setName( ticketType.getName() );
        ticketTypeResponse.setPerformanceId( ticketType.getPerformanceId() );
        ticketTypeResponse.setPrice( ticketType.getPrice() );
        ticketTypeResponse.setReservedQuantity( ticketType.getReservedQuantity() );
        ticketTypeResponse.setSoldQuantity( ticketType.getSoldQuantity() );
        ticketTypeResponse.setTotalQuantity( ticketType.getTotalQuantity() );
        ticketTypeResponse.setVersion( ticketType.getVersion() );

        return ticketTypeResponse;
    }
}
