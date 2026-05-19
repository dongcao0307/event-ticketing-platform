package fit.iuh.booking_service.controllers;

import fit.iuh.booking_service.dtos.ApiResponse;
import fit.iuh.booking_service.dtos.requests.AddBookingItemRequest;
import fit.iuh.booking_service.dtos.requests.CreateBookingRequest;
import fit.iuh.booking_service.dtos.requests.UpdateBookingStatusRequest;
import fit.iuh.booking_service.dtos.responses.BookingAdminResponse;
import fit.iuh.booking_service.dtos.responses.BookingResponse;
import fit.iuh.booking_service.dtos.responses.BookingWithEventResponse;
import fit.iuh.booking_service.services.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;

    @PostMapping
    public ApiResponse<BookingResponse> createBooking(@RequestBody CreateBookingRequest request) {
        return ApiResponse.<BookingResponse>builder()
                .body(bookingService.createBooking(request))
                .build();
    }

    @PostMapping("/{bookingId}/items")
    public ApiResponse<BookingResponse> addBookingItems(@PathVariable Long bookingId, @RequestBody List<AddBookingItemRequest> requests) {
        return ApiResponse.<BookingResponse>builder()
                .body(bookingService.addBookingItems(bookingId, requests))
                .build();
    }

    @PutMapping("/{bookingId}/status")
    public ApiResponse<BookingResponse> updateStatus(@PathVariable Long bookingId, @RequestBody UpdateBookingStatusRequest request) {
        return ApiResponse.<BookingResponse>builder()
                .body(bookingService.updateBookingStatus(bookingId, request))
                .build();
    }

    @GetMapping("/{bookingId}")
    public ApiResponse<BookingResponse> getBooking(@PathVariable Long bookingId) {
        return ApiResponse.<BookingResponse>builder()
                .body(bookingService.findById(bookingId))
                .build();
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<BookingWithEventResponse>> getBookingsByUser(@PathVariable Long userId) {
        return ApiResponse.<List<BookingWithEventResponse>>builder()
                .body(bookingService.getBookingsByUserId(userId))
                .build();
    }

    @GetMapping("/admin/search")
// Đã xóa dòng @PreAuthorize ở đây
    public ApiResponse<org.springframework.data.domain.Page<BookingAdminResponse>> searchBookingsByAdmin(
            @RequestParam(required = false) Long bookingId,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) fit.iuh.booking_service.entities.BookingStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size);

        // Đổi BookingResponse -> BookingAdminResponse ở đây
        return ApiResponse.<org.springframework.data.domain.Page<BookingAdminResponse>>builder()
                .body(bookingService.searchBookingsByAdmin(bookingId, userId, status, pageable))
                .build();
    }
}
