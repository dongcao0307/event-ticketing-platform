package fit.iuh.ticket_service.controllers;

import fit.iuh.ticket_service.dtos.ApiResponse;
import fit.iuh.ticket_service.dtos.responses.TicketResponse;
import fit.iuh.ticket_service.services.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketResponse>> getTicketById(@PathVariable Long id) {
        TicketResponse response = ticketService.findById(id);
        return ResponseEntity.ok(
                ApiResponse.<TicketResponse>builder()
                        .body(response)
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
