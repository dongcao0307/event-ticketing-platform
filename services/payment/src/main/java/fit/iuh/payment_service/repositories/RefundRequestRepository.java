package fit.iuh.payment_service.repositories;

import fit.iuh.payment_service.entities.RefundRequest;
import fit.iuh.payment_service.entities.RefundStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface RefundRequestRepository extends JpaRepository<RefundRequest, String> {
    Optional<RefundRequest> findFirstByIdempotencyKey(String idempotencyKey);

    Optional<RefundRequest> findFirstByOrderIdOrderByCreatedAtDesc(Long orderId);

    Optional<RefundRequest> findFirstByOrderIdAndStatusInOrderByCreatedAtDesc(Long orderId, Collection<RefundStatus> statuses);

    List<RefundRequest> findTop50ByStatusOrderByUpdatedAtAsc(RefundStatus status);
}
