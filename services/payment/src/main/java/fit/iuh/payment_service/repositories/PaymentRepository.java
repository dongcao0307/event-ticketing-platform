package fit.iuh.payment_service.repositories;

import fit.iuh.payment_service.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
	Optional<Payment> findByOrderId(Long orderId);
	Optional<Payment> findByPaymentToken(String paymentToken);
}
