package fit.iuh.booking_service.mappers;

import fit.iuh.booking_service.dtos.responses.BookingItemWithEventResponse;
import fit.iuh.booking_service.dtos.responses.BookingWithEventResponse;
import fit.iuh.booking_service.entities.Booking;
import fit.iuh.booking_service.entities.BookingItem;
import fit.iuh.event_service.grpc.generated.GetEventAndPerformanceResponse;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Mapper for converting Booking entities with gRPC event data to response DTOs.
 */
@Component
public class BookingWithEventMapper {

    @Autowired
    private EventGrpcMapper eventGrpcMapper;

    /**
     * Convert Booking to BookingWithEventResponse with first item's event details.
     * Since each booking typically has items from one event/performance,
     * we map event data to the booking level, not individual items.
     */
    public BookingWithEventResponse toBookingWithEventResponse(
            Booking booking,
            GetEventAndPerformanceResponse grpcResponse) {

        if (booking == null) {
            return null;
        }

        return BookingWithEventResponse.builder()
                .id(booking.getId())
                .userId(booking.getUserId())
                .idempotenceKey(booking.getIdempotenceKey())
                .subtotal(booking.getSubtotal())
                .discountAmount(booking.getDiscountAmount())
                .totalAmount(booking.getTotalAmount())
                .status(booking.getStatus())
                .expiredAt(booking.getExpiredAt())
                .createdAt(booking.getCreatedAt())
                .version(booking.getVersion())
                .event(eventGrpcMapper.toEventDetailDto(grpcResponse.getEvent()))
                .eventPerformance(eventGrpcMapper.toEventPerformanceDetailDto(grpcResponse.getEventPerformance()))
                .items(booking.getItems().stream()
                        .map(this::toBookingItemWithEventResponse)
                        .toList())
                .build();
    }

    /**
     * Convert BookingItem to BookingItemWithEventResponse (without event details).
     */
    public BookingItemWithEventResponse toBookingItemWithEventResponse(BookingItem item) {
        if (item == null) {
            return null;
        }

        return BookingItemWithEventResponse.builder()
                .id(item.getId())
                .ticketTypeId(item.getTicketTypeId())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .build();
    }
}
