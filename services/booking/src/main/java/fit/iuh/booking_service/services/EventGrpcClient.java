package fit.iuh.booking_service.services;

import fit.iuh.event_service.grpc.generated.EventGrpcServiceGrpc;
import fit.iuh.event_service.grpc.generated.GetEventAndPerformanceRequest;
import fit.iuh.event_service.grpc.generated.GetEventAndPerformanceResponse;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * gRPC Client for calling Event Service.
 * Uses io.grpc client to communicate with event-service's gRPC server.
 */
@Slf4j
@Service
public class EventGrpcClient {

    private final ManagedChannel channel;
    private final EventGrpcServiceGrpc.EventGrpcServiceBlockingStub eventGrpcStub;
    private final long deadlineMs;

    public EventGrpcClient(
            @Value("${grpc.client.event-service.host:localhost}") String host,
            @Value("${grpc.client.event-service.port:50051}") int port,
            @Value("${grpc.client.event-service.deadline-ms:2000}") long deadlineMs) {
        
        log.info("Initializing gRPC client for event-service at {}:{}", host, port);
        this.deadlineMs = deadlineMs;
        
        // Create managed channel for non-blocking communication
        this.channel = ManagedChannelBuilder
                .forAddress(host, port)
                .usePlaintext() // No TLS for local communication
                .build();
        
        // Create blocking stub for synchronous calls
        this.eventGrpcStub = EventGrpcServiceGrpc.newBlockingStub(channel);
    }

    /**
     * Get Event, EventPerformance and all TicketTypes by ticketTypeId.
     * This method calls the event-service gRPC server synchronously.
     * 
     * @param ticketTypeId The ticket type ID to query
     * @return GetEventAndPerformanceResponse containing event details
     * @throws Exception if gRPC call fails
     */
    @CircuitBreaker(name = "eventGrpc", fallbackMethod = "getEventDetailsFallback")
    public GetEventAndPerformanceResponse getEventDetailsByTicketTypeId(Long ticketTypeId) {
        try {
            log.info("Calling gRPC service to fetch event details for ticketTypeId: {}", ticketTypeId);
            
            // Build request
            GetEventAndPerformanceRequest request = GetEventAndPerformanceRequest.newBuilder()
                    .setTicketTypeId(ticketTypeId)
                    .build();

            // Call event-service gRPC method synchronously
                GetEventAndPerformanceResponse response = eventGrpcStub
                    .withDeadlineAfter(deadlineMs, TimeUnit.MILLISECONDS)
                    .getEventAndPerformanceByTicketType(request);
            
            log.info("Successfully retrieved event details from gRPC service");
            return response;
            
        } catch (Exception e) {
            log.error("Error calling gRPC service for ticketTypeId: {}", ticketTypeId, e);
            throw new RuntimeException("Failed to fetch event details from event-service", e);
        }
    }

    protected GetEventAndPerformanceResponse getEventDetailsFallback(Long ticketTypeId, Throwable throwable) {
        log.warn("Fallback for event-service gRPC, ticketTypeId={}", ticketTypeId, throwable);
        return GetEventAndPerformanceResponse.getDefaultInstance();
    }

    /**
     * Shutdown the gRPC channel.
     * Call this method when the service is shutting down.
     */
    public void shutdown() {
        if (channel != null && !channel.isShutdown()) {
            try {
                channel.shutdown();
                log.info("gRPC channel shutdown completed");
            } catch (Exception e) {
                log.error("Error shutting down gRPC channel", e);
            }
        }
    }
}
