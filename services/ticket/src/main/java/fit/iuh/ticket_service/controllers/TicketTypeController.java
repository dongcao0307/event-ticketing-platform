package fit.iuh.ticket_service.controllers;

import fit.iuh.ticket_service.dtos.ApiResponse;
import fit.iuh.ticket_service.dtos.requests.TicketTypeBulkWriteRequest;
import fit.iuh.ticket_service.dtos.requests.TicketTypeCreateRequest;
import fit.iuh.ticket_service.dtos.requests.TicketTypeUpdateRequest;
import fit.iuh.ticket_service.dtos.responses.TicketTypeResponse;
import fit.iuh.ticket_service.exceptions.AppException;
import fit.iuh.ticket_service.exceptions.ErrorCode;
import fit.iuh.ticket_service.services.TicketTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizer/ticket_type")
@RequiredArgsConstructor
public class TicketTypeController {
    private final TicketTypeService ticketTypeService;

    @PostMapping
    public ApiResponse<Boolean> addTicketType(@RequestBody TicketTypeCreateRequest request) {
        return ApiResponse.<Boolean>builder()
                .body(ticketTypeService.addTicketType(request))
                .build();
    }

    @PostMapping("/bulk")
    public ApiResponse<Boolean> addTicketTypes(@RequestBody List<TicketTypeCreateRequest> requests) {
        return ApiResponse.<Boolean>builder()
                .body(ticketTypeService.addTicketTypes(requests))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<Boolean> updateTicketType(@RequestBody TicketTypeUpdateRequest request, @PathVariable long id) {
        if (request.getId() != id)
            throw new AppException(ErrorCode.INVALID_POST_REQUEST);
        return ApiResponse.<Boolean>builder()
                .body(ticketTypeService.updateTicketType(request))
                .build();
    }

    @PutMapping("/bulk")
    public ApiResponse<Boolean> updateTicketTypes(@RequestBody List<TicketTypeUpdateRequest> requests) {
        return ApiResponse.<Boolean>builder()
                .body(ticketTypeService.updateTicketTypes(requests))
                .build();
    }

    @GetMapping
    public ApiResponse<List<TicketTypeResponse>> getAllTicketTypes() {
        return ApiResponse.<List<TicketTypeResponse>>builder()
                .body(ticketTypeService.findAll())
                .build();
    }

    @PostMapping("/upsert/bulk")
    public ApiResponse<List<TicketTypeResponse>> upsertTicketTypes(@RequestBody List<TicketTypeBulkWriteRequest> requests) {
        return ApiResponse.<List<TicketTypeResponse>>builder()
                .body(ticketTypeService.upsertTicketTypes(requests))
                .build();
    }
}
