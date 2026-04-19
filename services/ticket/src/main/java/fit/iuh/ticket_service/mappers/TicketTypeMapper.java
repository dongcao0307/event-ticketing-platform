package fit.iuh.ticket_service.mappers;

import fit.iuh.ticket_service.dtos.requests.TicketTypeCreateRequest;
import fit.iuh.ticket_service.dtos.requests.TicketTypeUpdateRequest;
import fit.iuh.ticket_service.dtos.responses.TicketTypeResponse;
import fit.iuh.ticket_service.entities.TicketType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TicketTypeMapper {
    @Mapping(target = "reservedQuantity", constant = "0")
    @Mapping(target = "soldQuantity", constant = "0")
    @Mapping(target = "id", ignore = true)
    TicketType toTicketType(TicketTypeCreateRequest request);

    @Mapping(target = "id", ignore = true)
    void updateTicketType(TicketTypeUpdateRequest request, @MappingTarget TicketType ticketType);

    TicketTypeResponse toTicketTypeResponse(TicketType ticketType);
}
