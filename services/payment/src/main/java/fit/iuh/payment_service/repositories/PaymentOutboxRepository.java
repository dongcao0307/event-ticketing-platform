package fit.iuh.payment_service.repositories;

import fit.iuh.payment_service.entities.PaymentOutboxEvent;
import fit.iuh.payment_service.entities.PaymentOutboxStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface PaymentOutboxRepository extends JpaRepository<PaymentOutboxEvent, Long> {
    List<PaymentOutboxEvent> findTop50ByStatusOrderByCreatedAtAsc(PaymentOutboxStatus status);

    List<PaymentOutboxEvent> findTop50ByStatusAndRetryCountLessThanOrderByCreatedAtAsc(PaymentOutboxStatus status, int retryCount);

    boolean existsByAggregateTypeAndAggregateIdAndEventTypeAndStatusIn(
            String aggregateType,
            String aggregateId,
            String eventType,
            Collection<PaymentOutboxStatus> statuses
    );
}
