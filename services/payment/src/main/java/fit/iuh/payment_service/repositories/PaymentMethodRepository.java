package fit.iuh.payment_service.repositories;

import fit.iuh.payment_service.entities.PaymentMethod;
import fit.iuh.payment_service.entities.ProcessorType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, String> {
	Optional<PaymentMethod> findByIdAndProcessorTypeAndIsAvailableTrue(String id, ProcessorType processorType);
}
