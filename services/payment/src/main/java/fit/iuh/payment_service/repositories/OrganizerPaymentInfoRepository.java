package fit.iuh.payment_service.repositories;

import fit.iuh.payment_service.entities.OrganizerPaymentInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizerPaymentInfoRepository extends JpaRepository<OrganizerPaymentInfo, Long> {
}
