package fit.iuh.ticket_service.controllers;

import fit.iuh.ticket_service.dtos.ApiResponse;
import fit.iuh.ticket_service.dtos.requests.TicketCreateRequest;
import fit.iuh.ticket_service.dtos.responses.TicketResponse;
import fit.iuh.ticket_service.exceptions.AppException;
import fit.iuh.ticket_service.exceptions.ErrorCode;
import fit.iuh.ticket_service.services.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @Value("${ticket.sync.enabled:false}")
    private boolean ticketSyncEnabled;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketResponse>> getTicketById(@PathVariable Long id) {
        TicketResponse response = ticketService.findById(id);
        return ResponseEntity.ok(
                ApiResponse.<TicketResponse>builder()
                        .body(response)
                        .build()
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Boolean>> createTicket(@RequestBody TicketCreateRequest request) {
        if (!ticketSyncEnabled) {
            throw new AppException(ErrorCode.TICKET_SYNC_DISABLED);
        }
        boolean result = ticketService.addTicket(request);
        return ResponseEntity.ok(
                ApiResponse.<Boolean>builder()
                        .body(result)
                        .build()
        );
    }

    @PostMapping("/bulk")
    public ResponseEntity<ApiResponse<Boolean>> bulkCreateTickets(@RequestBody List<TicketCreateRequest> requests) {
        if (!ticketSyncEnabled) {
            throw new AppException(ErrorCode.TICKET_SYNC_DISABLED);
        }
        boolean result = ticketService.bulkAddTickets(requests);
        return ResponseEntity.ok(
                ApiResponse.<Boolean>builder()
                        .body(result)
                        .build()
        );
    }

    @GetMapping("/performance/{performanceId}/booked-seats")
    public ResponseEntity<ApiResponse<List<String>>> getBookedSeats(@PathVariable Long performanceId) {
        List<String> bookedSeats = ticketService.getBookedSeats(performanceId);
        return ResponseEntity.ok(
                ApiResponse.<List<String>>builder()
                        .body(bookedSeats)
                        .build()
        );
    }
}
