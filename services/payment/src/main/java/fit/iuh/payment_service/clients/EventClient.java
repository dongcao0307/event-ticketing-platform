package fit.iuh.payment_service.clients;

import fit.iuh.event_service.grpc.generated.EventGrpcServiceGrpc;
import fit.iuh.event_service.grpc.generated.GetEventAndPerformanceRequest;
import fit.iuh.event_service.grpc.generated.GetEventAndPerformanceResponse;
import fit.iuh.event_service.grpc.generated.TicketTypeDto;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PreDestroy;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.TimeUnit;

@Slf4j
@Component
public class EventClient {
    private final ManagedChannel channel;
    private final EventGrpcServiceGrpc.EventGrpcServiceBlockingStub eventGrpcStub;
    private final long deadlineMs;

    public EventClient(
            @Value("${grpc.client.event-service.host:localhost}") String host,
            @Value("${grpc.client.event-service.port:50051}") int port,
            @Value("${grpc.client.event-service.deadline-ms:2000}") long deadlineMs) {
        this.deadlineMs = deadlineMs;
        this.channel = ManagedChannelBuilder.forAddress(host, port).usePlaintext().build();
        this.eventGrpcStub = EventGrpcServiceGrpc.newBlockingStub(channel);
    }

    @CircuitBreaker(name = "eventGrpc", fallbackMethod = "getTicketTypeFallback")
    public TicketTypeInfo getTicketType(Long ticketTypeId) {
        try {
            log.info("Calling event gRPC for ticketTypeId={}", ticketTypeId);
            GetEventAndPerformanceRequest request = GetEventAndPerformanceRequest.newBuilder()
                    .setTicketTypeId(ticketTypeId)
                    .build();

            GetEventAndPerformanceResponse response = eventGrpcStub
                    .withDeadlineAfter(deadlineMs, TimeUnit.MILLISECONDS)
                    .getEventAndPerformanceByTicketType(request);

            TicketTypeInfo info = new TicketTypeInfo();
            info.setId(ticketTypeId);
            response.getTicketTypesList().stream()
                    .filter(ticketType -> ticketType.getId() == ticketTypeId)
                    .findFirst()
                    .ifPresent(ticketType -> info.setSaleEnd(parseDateTime(ticketType.getSaleEnd())));
            return info;
        } catch (Exception ex) {
            log.warn("Error fetching ticketType {} via gRPC: {}", ticketTypeId, ex.getMessage());
            throw new RuntimeException("Failed to fetch ticketType via gRPC", ex);
        }
    }

    protected TicketTypeInfo getTicketTypeFallback(Long ticketTypeId, Throwable throwable) {
        log.warn("Fallback for event-service gRPC, ticketTypeId={}", ticketTypeId, throwable);
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

    public static class TicketTypeInfo {
        private Long id;
        private LocalDateTime saleEnd;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public LocalDateTime getSaleEnd() { return saleEnd; }
        public void setSaleEnd(LocalDateTime saleEnd) { this.saleEnd = saleEnd; }
    }
}
