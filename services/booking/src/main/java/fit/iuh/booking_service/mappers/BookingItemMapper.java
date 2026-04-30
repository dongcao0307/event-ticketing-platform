package fit.iuh.booking_service.mappers;

import fit.iuh.booking_service.dtos.responses.BookingItemResponse;
import fit.iuh.booking_service.entities.BookingItem;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BookingItemMapper {
    BookingItemResponse toBookingItemResponse(BookingItem bookingItem);
}
