package fit.iuh.event_service.repositories;


import fit.iuh.event_service.models.OrganizerPaymentInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizerPaymentInfoRepository extends JpaRepository<OrganizerPaymentInfo, Long> {
}