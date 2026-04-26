package fit.iuh.ticket_service.mappers;

import fit.iuh.ticket_service.dtos.requests.TicketTypeCreateRequest;
import fit.iuh.ticket_service.dtos.requests.TicketTypeUpdateRequest;
import fit.iuh.ticket_service.dtos.responses.TicketTypeResponse;
import fit.iuh.ticket_service.entities.TicketType;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-24T23:55:17+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 23 (Oracle Corporation)"
)
@Component
public class TicketTypeMapperImpl implements TicketTypeMapper {

    @Override
    public TicketType toTicketType(TicketTypeCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        TicketType.TicketTypeBuilder ticketType = TicketType.builder();

        ticketType.performanceId( request.getPerformanceId() );
        ticketType.name( request.getName() );
        ticketType.price( request.getPrice() );
        ticketType.totalQuantity( request.getTotalQuantity() );
        ticketType.maxTicketsPerUser( request.getMaxTicketsPerUser() );
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

        ticketType.setName( request.getName() );
        ticketType.setPrice( request.getPrice() );
        ticketType.setTotalQuantity( request.getTotalQuantity() );
        ticketType.setSoldQuantity( request.getSoldQuantity() );
        ticketType.setReservedQuantity( request.getReservedQuantity() );
        ticketType.setMaxTicketsPerUser( request.getMaxTicketsPerUser() );
        ticketType.setVersion( request.getVersion() );
    }

    @Override
    public TicketTypeResponse toTicketTypeResponse(TicketType ticketType) {
        if ( ticketType == null ) {
            return null;
        }

        TicketTypeResponse ticketTypeResponse = new TicketTypeResponse();

        ticketTypeResponse.setId( ticketType.getId() );
        ticketTypeResponse.setPerformanceId( ticketType.getPerformanceId() );
        ticketTypeResponse.setName( ticketType.getName() );
        ticketTypeResponse.setPrice( ticketType.getPrice() );
        ticketTypeResponse.setTotalQuantity( ticketType.getTotalQuantity() );
        ticketTypeResponse.setSoldQuantity( ticketType.getSoldQuantity() );
        ticketTypeResponse.setReservedQuantity( ticketType.getReservedQuantity() );
        ticketTypeResponse.setMaxTicketsPerUser( ticketType.getMaxTicketsPerUser() );
        ticketTypeResponse.setVersion( ticketType.getVersion() );

        return ticketTypeResponse;
    }
}
