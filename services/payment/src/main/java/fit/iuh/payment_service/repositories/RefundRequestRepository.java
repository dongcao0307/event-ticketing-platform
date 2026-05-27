package fit.iuh.payment_service.repositories;

import fit.iuh.payment_service.entities.RefundRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefundRequestRepository extends JpaRepository<RefundRequest, String> {
    Optional<RefundRequest> findFirstByIdempotencyKey(String idempotencyKey);
}
