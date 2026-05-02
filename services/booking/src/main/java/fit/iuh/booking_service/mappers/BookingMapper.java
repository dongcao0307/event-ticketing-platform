package fit.iuh.booking_service.mappers;

import fit.iuh.booking_service.dtos.responses.BookingResponse;
import fit.iuh.booking_service.entities.Booking;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {BookingItemMapper.class})
public interface BookingMapper {
    BookingResponse toBookingResponse(Booking booking);
}
