package fit.iuh.ticket_service.mappers;

import fit.iuh.ticket_service.dtos.requests.TicketCreateRequest;
import fit.iuh.ticket_service.dtos.requests.TicketUpdateRequest;
import fit.iuh.ticket_service.dtos.responses.TicketResponse;
import fit.iuh.ticket_service.entities.Ticket;
import fit.iuh.ticket_service.services.TicketTypeService;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {TicketTypeService.class})
public interface TicketMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "ticketType", source = "ticketTypeId")
    @Mapping(target = "ticketStatus", constant = "PENDING")
    @Mapping(target = "checkInAt", ignore = true)
    Ticket toTicket(TicketCreateRequest request);
    @Mapping(target = "id", ignore = true)
    void updateTicket(TicketUpdateRequest request, @MappingTarget Ticket ticket);
    TicketResponse toTicketResponse(Ticket ticket);
}
