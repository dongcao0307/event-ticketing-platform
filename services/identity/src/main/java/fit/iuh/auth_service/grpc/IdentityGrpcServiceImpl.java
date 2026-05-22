package fit.iuh.auth_service.grpc;

import fit.iuh.auth_service.entity.User;
import fit.iuh.auth_service.repository.UserRepository;
import fit.iuh.identity_service.grpc.generated.GetAccountByUserIdRequest;
import fit.iuh.identity_service.grpc.generated.GetAccountByUserIdResponse;
import fit.iuh.identity_service.grpc.generated.IdentityGrpcServiceGrpc;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@GrpcService
@RequiredArgsConstructor
public class IdentityGrpcServiceImpl extends IdentityGrpcServiceGrpc.IdentityGrpcServiceImplBase {

    private final UserRepository userRepository;

    @Transactional
    @Override
    public void getAccountByUserId(GetAccountByUserIdRequest request,
                                   StreamObserver<GetAccountByUserIdResponse> responseObserver) {
        long userId = request.getUserId();
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

            String email = user.getAccount() != null ? user.getAccount().getEmail() : "";
            String userName = user.getAccount() != null ? user.getAccount().getUserName() : "";

            GetAccountByUserIdResponse response = GetAccountByUserIdResponse.newBuilder()
                    .setUserId(user.getId())
                    .setEmail(email == null ? "" : email)
                    .setUserName(userName == null ? "" : userName)
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception ex) {
            log.error("Failed to resolve account for userId {}", userId, ex);
            responseObserver.onError(
                    Status.NOT_FOUND
                            .withDescription("User not found")
                            .asException()
            );
        }
    }
}
