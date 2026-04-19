package fit.iuh.ticket_service.services;

import fit.iuh.ticket_service.dtos.requests.TicketCreateRequest;
import fit.iuh.ticket_service.dtos.requests.TicketUpdateRequest;
import fit.iuh.ticket_service.dtos.responses.TicketResponse;
import fit.iuh.ticket_service.entities.Ticket;

public interface TicketService {
    Ticket findByIdRaw(Long id);
    TicketResponse findById(Long id);
    boolean addTicket(TicketCreateRequest request);
    boolean updateTicket(TicketUpdateRequest request);
}
