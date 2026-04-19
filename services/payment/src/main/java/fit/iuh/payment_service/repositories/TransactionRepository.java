package fit.iuh.payment_service.repositories;

import fit.iuh.payment_service.entities.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, String> {
	boolean existsByProviderTransactionId(String providerTransactionId);

	List<Transaction> findByPaymentIdOrderByTimestampDesc(Long paymentId);
}
