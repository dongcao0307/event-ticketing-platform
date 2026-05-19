package fit.iuh.payment_service.repositories;

import fit.iuh.payment_service.entities.Payout;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PayoutRepository extends JpaRepository<Payout, Long> {
}
