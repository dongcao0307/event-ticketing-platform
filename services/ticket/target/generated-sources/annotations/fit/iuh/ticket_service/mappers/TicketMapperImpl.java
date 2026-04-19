package fit.iuh.ticket_service.mappers;

import fit.iuh.ticket_service.dtos.requests.TicketCreateRequest;
import fit.iuh.ticket_service.dtos.requests.TicketUpdateRequest;
import fit.iuh.ticket_service.dtos.responses.TicketResponse;
import fit.iuh.ticket_service.entities.Ticket;
import fit.iuh.ticket_service.entities.TicketStatus;
import fit.iuh.ticket_service.services.TicketTypeService;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-17T21:38:52+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 23 (Oracle Corporation)"
)
@Component
public class TicketMapperImpl implements TicketMapper {

    @Autowired
    private TicketTypeService ticketTypeService;

    @Override
    public Ticket toTicket(TicketCreateRequest request) {
        if ( request == null ) {
            return null;
        }

        Ticket.TicketBuilder ticket = Ticket.builder();

        ticket.ticketType( ticketTypeService.findByIdRaw( request.getTicketTypeId() ) );
        ticket.performanceId( request.getPerformanceId() );
        ticket.userId( request.getUserId() );
        ticket.orderId( request.getOrderId() );
        ticket.qrCode( request.getQrCode() );
        ticket.priceAtPurchase( request.getPriceAtPurchase() );

        ticket.ticketStatus( TicketStatus.ACTIVE );

        return ticket.build();
    }

    @Override
    public void updateTicket(TicketUpdateRequest request, Ticket ticket) {
        if ( request == null ) {
            return;
        }

        ticket.setQrCode( request.getQrCode() );
        ticket.setTicketStatus( request.getTicketStatus() );
        ticket.setCheckInAt( request.getCheckInAt() );
    }

    @Override
    public TicketResponse toTicketResponse(Ticket ticket) {
        if ( ticket == null ) {
            return null;
        }

        TicketResponse ticketResponse = new TicketResponse();

        ticketResponse.setId( ticket.getId() );
        ticketResponse.setTicketType( ticket.getTicketType() );
        ticketResponse.setPerformanceId( ticket.getPerformanceId() );
        ticketResponse.setUserId( ticket.getUserId() );
        ticketResponse.setOrderId( ticket.getOrderId() );
        ticketResponse.setQrCode( ticket.getQrCode() );
        ticketResponse.setPriceAtPurchase( ticket.getPriceAtPurchase() );
        ticketResponse.setTicketStatus( ticket.getTicketStatus() );
        ticketResponse.setCheckInAt( ticket.getCheckInAt() );

        return ticketResponse;
    }
}
