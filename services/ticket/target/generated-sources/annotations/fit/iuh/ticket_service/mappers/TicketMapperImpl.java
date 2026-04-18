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
    date = "2026-04-18T22:44:34+0700",
    comments = "version: 1.6.3, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
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
        ticket.orderId( request.getOrderId() );
        ticket.performanceId( request.getPerformanceId() );
        ticket.priceAtPurchase( request.getPriceAtPurchase() );
        ticket.qrCode( request.getQrCode() );
        ticket.userId( request.getUserId() );

        ticket.ticketStatus( TicketStatus.ACTIVE );

        return ticket.build();
    }

    @Override
    public void updateTicket(TicketUpdateRequest request, Ticket ticket) {
        if ( request == null ) {
            return;
        }

        ticket.setCheckInAt( request.getCheckInAt() );
        ticket.setQrCode( request.getQrCode() );
        ticket.setTicketStatus( request.getTicketStatus() );
    }

    @Override
    public TicketResponse toTicketResponse(Ticket ticket) {
        if ( ticket == null ) {
            return null;
        }

        TicketResponse ticketResponse = new TicketResponse();

        ticketResponse.setCheckInAt( ticket.getCheckInAt() );
        ticketResponse.setId( ticket.getId() );
        ticketResponse.setOrderId( ticket.getOrderId() );
        ticketResponse.setPerformanceId( ticket.getPerformanceId() );
        ticketResponse.setPriceAtPurchase( ticket.getPriceAtPurchase() );
        ticketResponse.setQrCode( ticket.getQrCode() );
        ticketResponse.setTicketStatus( ticket.getTicketStatus() );
        ticketResponse.setTicketType( ticket.getTicketType() );
        ticketResponse.setUserId( ticket.getUserId() );

        return ticketResponse;
    }
}
