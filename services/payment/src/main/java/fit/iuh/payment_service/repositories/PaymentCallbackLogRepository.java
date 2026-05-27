package fit.iuh.payment_service.repositories;

import fit.iuh.payment_service.entities.PaymentCallbackLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentCallbackLogRepository extends JpaRepository<PaymentCallbackLog, Long> {
    Optional<PaymentCallbackLog> findFirstByPaymentReferenceOrderByReceivedAtDesc(String paymentReference);

    List<PaymentCallbackLog> findByPaymentIdOrderByReceivedAtDesc(Long paymentId);
}