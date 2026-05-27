package fit.iuh.payment_service.clients;

import fit.iuh.booking_service.grpc.generated.BookingDto;
import fit.iuh.booking_service.grpc.generated.BookingGrpcServiceGrpc;
import fit.iuh.booking_service.grpc.generated.GetBookingByIdRequest;
import fit.iuh.booking_service.grpc.generated.GetBookingByIdResponse;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PreDestroy;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
public class BookingClient {
    private final ManagedChannel channel;
    private final BookingGrpcServiceGrpc.BookingGrpcServiceBlockingStub bookingGrpcStub;
    private final long deadlineMs;

    public BookingClient(
            @Value("${grpc.client.booking-service.host:localhost}") String host,
            @Value("${grpc.client.booking-service.port:50053}") int port,
            @Value("${grpc.client.booking-service.deadline-ms:2000}") long deadlineMs) {
        this.deadlineMs = deadlineMs;
        this.channel = ManagedChannelBuilder.forAddress(host, port).usePlaintext().build();
        this.bookingGrpcStub = BookingGrpcServiceGrpc.newBlockingStub(channel);
    }

    @CircuitBreaker(name = "bookingGrpc", fallbackMethod = "getBookingFallback")
    public BookingInfo getBooking(Long bookingId) {
        try {
            log.info("Calling booking gRPC for bookingId={}", bookingId);
            GetBookingByIdRequest request = GetBookingByIdRequest.newBuilder()
                    .setBookingId(bookingId)
                    .build();

            GetBookingByIdResponse response = bookingGrpcStub
                    .withDeadlineAfter(deadlineMs, TimeUnit.MILLISECONDS)
                    .getBookingById(request);

            BookingDto bookingDto = response.getBooking();
            if (bookingDto == null) {
                return null;
            }

            BookingInfo info = new BookingInfo();
            info.setId(bookingDto.getId());
            info.setUserId(bookingDto.getUserId());
            info.setStatus(bookingDto.getStatus());
            info.setTotalAmount(BigDecimal.valueOf(bookingDto.getTotalAmount()));
            info.setCreatedAt(parseDateTime(bookingDto.getCreatedAt()));
            info.setItems(bookingDto.getItemsList().stream()
                    .map(item -> {
                        BookingInfo.BookingItemInfo bookingItemInfo = new BookingInfo.BookingItemInfo();
                        bookingItemInfo.setTicketTypeId(item.getTicketTypeId());
                        bookingItemInfo.setQuantity(item.getQuantity());
                        bookingItemInfo.setUnitPrice(BigDecimal.valueOf(item.getUnitPrice()));
                        bookingItemInfo.setTicketTypeName(null);
                        return bookingItemInfo;
                    })
                    .filter(item -> item.getTicketTypeId() != null && item.getTicketTypeId() > 0 && item.getQuantity() != null && item.getQuantity() > 0)
                    .toList());
            return info;
        } catch (Exception ex) {
            log.warn("Error fetching booking {} via gRPC: {}", bookingId, ex.getMessage());
            throw new RuntimeException("Failed to fetch booking via gRPC", ex);
        }
    }

    protected BookingInfo getBookingFallback(Long bookingId, Throwable throwable) {
        log.warn("Fallback for booking-service gRPC, bookingId={}", bookingId, throwable);
        return null;
    }

    private LocalDateTime parseDateTime(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return LocalDateTime.parse(value);
        } catch (Exception e) {
            try {
                return LocalDateTime.parse(value, DateTimeFormatter.ISO_DATE_TIME);
            } catch (Exception ex) {
                log.warn("Failed parse datetime: {}", value);
                return null;
            }
        }
    }

    @PreDestroy
    public void shutdown() {
        if (channel != null && !channel.isShutdown()) {
            channel.shutdown();
        }
    }

    public static class BookingInfo {
        private Long id;
        private Long userId;
        private String status;
        private LocalDateTime createdAt;
        private List<BookingItemInfo> items = new ArrayList<>();
        private BigDecimal totalAmount;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
        public List<BookingItemInfo> getItems() { return items; }
        public void setItems(List<BookingItemInfo> items) { this.items = items; }
        public BigDecimal getTotalAmount() { return totalAmount; }
        public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

        public static class BookingItemInfo {
            private Long ticketTypeId;
            private Integer quantity;
            private BigDecimal unitPrice;
            private String ticketTypeName;

            public Long getTicketTypeId() { return ticketTypeId; }
            public void setTicketTypeId(Long ticketTypeId) { this.ticketTypeId = ticketTypeId; }
            public Integer getQuantity() { return quantity; }
            public void setQuantity(Integer quantity) { this.quantity = quantity; }
            public BigDecimal getUnitPrice() { return unitPrice; }
            public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }
            public String getTicketTypeName() { return ticketTypeName; }
            public void setTicketTypeName(String ticketTypeName) { this.ticketTypeName = ticketTypeName; }
        }
    }
}
