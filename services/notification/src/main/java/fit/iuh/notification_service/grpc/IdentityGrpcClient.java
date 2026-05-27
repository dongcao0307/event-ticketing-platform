package fit.iuh.notification_service.grpc;

import fit.iuh.identity_service.grpc.generated.GetAccountByUserIdRequest;
import fit.iuh.identity_service.grpc.generated.GetAccountByUserIdResponse;
import fit.iuh.identity_service.grpc.generated.IdentityGrpcServiceGrpc;
import fit.iuh.notification_service.services.payload.IdentityAccount;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
public class IdentityGrpcClient {

    private final ManagedChannel channel;
    private final IdentityGrpcServiceGrpc.IdentityGrpcServiceBlockingStub identityStub;
    private final long deadlineMs;

    public IdentityGrpcClient(
            @Value("${grpc.client.identity-service.host:localhost}") String host,
            @Value("${grpc.client.identity-service.port:50052}") int port,
            @Value("${grpc.client.identity-service.deadline-ms:2000}") long deadlineMs) {
        this.deadlineMs = deadlineMs;
        this.channel = ManagedChannelBuilder.forAddress(host, port)
                .usePlaintext()
                .build();
        this.identityStub = IdentityGrpcServiceGrpc.newBlockingStub(channel);
    }

    @CircuitBreaker(name = "identityGrpc", fallbackMethod = "getAccountByUserIdFallback")
    public Optional<IdentityAccount> getAccountByUserId(Long userId) {
        if (userId == null) {
            return Optional.empty();
        }
        try {
            GetAccountByUserIdRequest request = GetAccountByUserIdRequest.newBuilder()
                    .setUserId(userId)
                    .build();
                GetAccountByUserIdResponse response = identityStub
                    .withDeadlineAfter(deadlineMs, TimeUnit.MILLISECONDS)
                    .getAccountByUserId(request);
            if (response == null || response.getEmail().isBlank()) {
                return Optional.empty();
            }
            return Optional.of(IdentityAccount.builder()
                    .userId(response.getUserId())
                    .email(response.getEmail())
                    .userName(response.getUserName())
                    .build());
        } catch (Exception ex) {
            log.warn("Failed to fetch identity account for userId {}", userId, ex);
            throw ex;
        }
    }

    protected Optional<IdentityAccount> getAccountByUserIdFallback(Long userId, Throwable throwable) {
        log.warn("Fallback for identity-service lookup, userId={}", userId, throwable);
        return Optional.empty();
    }

    public void shutdown() {
        if (channel != null && !channel.isShutdown()) {
            channel.shutdown();
        }
    }
}
