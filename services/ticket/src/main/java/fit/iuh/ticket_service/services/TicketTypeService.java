package fit.iuh.ticket_service.services;

import fit.iuh.ticket_service.dtos.requests.TicketTypeCreateRequest;
import fit.iuh.ticket_service.dtos.requests.TicketTypeBulkWriteRequest;
import fit.iuh.ticket_service.dtos.requests.TicketTypeUpdateRequest;
import fit.iuh.ticket_service.dtos.responses.TicketTypeResponse;
import fit.iuh.ticket_service.entities.TicketType;

import java.util.List;

public interface TicketTypeService {
    boolean addTicketType(TicketTypeCreateRequest request);
    boolean addTicketTypes(List<TicketTypeCreateRequest> requests);
    boolean updateTicketType(TicketTypeUpdateRequest request);
    boolean updateTicketTypes(List<TicketTypeUpdateRequest> requests);
    List<TicketTypeResponse> upsertTicketTypes(List<TicketTypeBulkWriteRequest> requests);
    TicketTypeResponse findById(Long id);
    TicketType findByIdRaw(Long id);
    List<TicketTypeResponse> findAll();
}
