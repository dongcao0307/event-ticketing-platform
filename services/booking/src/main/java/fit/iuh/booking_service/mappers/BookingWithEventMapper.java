package fit.iuh.booking_service.mappers;

import fit.iuh.booking_service.dtos.responses.BookingItemWithEventResponse;
import fit.iuh.booking_service.dtos.responses.BookingWithEventResponse;
import fit.iuh.booking_service.entities.Booking;
import fit.iuh.booking_service.entities.BookingItem;
import fit.iuh.event_service.grpc.generated.GetEventAndPerformanceResponse;
import fit.iuh.event_service.grpc.generated.TicketTypeDto;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

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

        // Cache ticket types vào Map để lookup nhanh O(1) thay vì O(n) cho mỗi item
        Map<Long, TicketTypeDto> ticketTypesMap = grpcResponse.getTicketTypesList().stream()
                .collect(Collectors.toMap(TicketTypeDto::getId, Function.identity()));

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
                        .map(item -> toBookingItemWithEventResponse(item, ticketTypesMap))
                        .toList())
                .build();
    }

    /**
     * Convert BookingItem to BookingItemWithEventResponse with ticket name from cached ticket types Map.
     * Uses O(1) HashMap lookup instead of O(n) stream filtering for better performance.
     */
    public BookingItemWithEventResponse toBookingItemWithEventResponse(BookingItem item,
            Map<Long, TicketTypeDto> ticketTypesMap) {
        if (item == null) {
            return null;
        }

        // Lookup ticket type từ map - O(1) operation
        TicketTypeDto ticketTypeDto = ticketTypesMap.get(item.getTicketTypeId());
        String ticketName = ticketTypeDto != null ? ticketTypeDto.getName() : "Vé";

        return BookingItemWithEventResponse.builder()
                .id(item.getId())
                .ticketTypeId(item.getTicketTypeId())
                .ticketName(ticketName)
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .build();
    }
}
