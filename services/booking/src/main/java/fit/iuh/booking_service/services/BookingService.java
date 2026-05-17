package fit.iuh.booking_service.services;

import fit.iuh.booking_service.dtos.requests.AddBookingItemRequest;
import fit.iuh.booking_service.dtos.requests.CreateBookingRequest;
import fit.iuh.booking_service.dtos.requests.UpdateBookingStatusRequest;
import fit.iuh.booking_service.dtos.responses.BookingResponse;
import fit.iuh.booking_service.dtos.responses.BookingWithEventResponse;

import java.util.List;

public interface BookingService {
    BookingResponse createBooking(CreateBookingRequest request);
    BookingResponse addBookingItems(Long bookingId, List<AddBookingItemRequest> requests);
    BookingResponse updateBookingStatus(Long bookingId, UpdateBookingStatusRequest request);
    BookingResponse findById(Long bookingId);
    List<BookingWithEventResponse> getBookingsByUserId(Long userId);
}
