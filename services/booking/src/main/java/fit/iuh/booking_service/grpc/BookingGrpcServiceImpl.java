package fit.iuh.booking_service.grpc;

import fit.iuh.booking_service.entities.Booking;
import fit.iuh.booking_service.entities.BookingItem;
import fit.iuh.booking_service.repositories.BookingRepository;
import fit.iuh.booking_service.grpc.generated.BookingDto;
import fit.iuh.booking_service.grpc.generated.BookingGrpcServiceGrpc;
import fit.iuh.booking_service.grpc.generated.BookingItemDto;
import fit.iuh.booking_service.grpc.generated.GetBookingByIdRequest;
import fit.iuh.booking_service.grpc.generated.GetBookingByIdResponse;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@GrpcService
@RequiredArgsConstructor
public class BookingGrpcServiceImpl extends BookingGrpcServiceGrpc.BookingGrpcServiceImplBase {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    private final BookingRepository bookingRepository;

    @Override
    @Transactional(readOnly = true)
    public void getBookingById(GetBookingByIdRequest request, StreamObserver<GetBookingByIdResponse> responseObserver) {
        try {
            Long bookingId = request.getBookingId();
            log.info("Received gRPC request for bookingId={}", bookingId);

            Booking booking = bookingRepository.findByIdWithItems(bookingId)
                    .orElseThrow(() -> new IllegalArgumentException("Booking not found: " + bookingId));

            BookingDto bookingDto = BookingDto.newBuilder()
                    .setId(booking.getId() != null ? booking.getId() : 0L)
                    .setUserId(booking.getUserId() != null ? booking.getUserId() : 0L)
                    .setIdempotenceKey(booking.getIdempotenceKey() != null ? booking.getIdempotenceKey() : "")
                    .setSubtotal(toDouble(booking.getSubtotal()))
                    .setDiscountAmount(toDouble(booking.getDiscountAmount()))
                    .setTotalAmount(toDouble(booking.getTotalAmount()))
                    .setStatus(booking.getStatus() != null ? booking.getStatus().name() : "")
                    .setCreatedAt(booking.getCreatedAt() != null ? booking.getCreatedAt().format(FORMATTER) : "")
                    .addAllItems(mapItems(booking.getItems()))
                    .build();

            GetBookingByIdResponse response = GetBookingByIdResponse.newBuilder()
                    .setBooking(bookingDto)
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception ex) {
            log.error("Error processing booking gRPC request", ex);
            responseObserver.onError(Status.NOT_FOUND
                    .withDescription(ex.getMessage())
                    .asRuntimeException());
        }
    }

    private List<BookingItemDto> mapItems(List<BookingItem> items) {
        return items.stream()
                .map(item -> BookingItemDto.newBuilder()
                        .setId(item.getId() != null ? item.getId() : 0L)
                        .setTicketTypeId(item.getTicketTypeId() != null ? item.getTicketTypeId() : 0L)
                        .setQuantity(item.getQuantity() != null ? item.getQuantity() : 0)
                        .setUnitPrice(toDouble(item.getUnitPrice()))
                        .build())
                .toList();
    }

    private double toDouble(BigDecimal value) {
        return value == null ? 0.0 : value.doubleValue();
    }
}
