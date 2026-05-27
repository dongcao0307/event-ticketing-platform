package fit.iuh.payment_service.workers;

import fit.iuh.payment_service.entities.RefundRequest;
import fit.iuh.payment_service.entities.RefundStatus;
import fit.iuh.payment_service.repositories.RefundRequestRepository;
import fit.iuh.payment_service.services.RefundProcessor;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
public class RefundWorker {
    private static final Logger log = LoggerFactory.getLogger(RefundWorker.class);

    private final RefundRequestRepository refundRequestRepository;
    private final RefundProcessor refundProcessor;

    @Scheduled(fixedDelayString = "30000")
    @Transactional
    public void pollAndProcess() {
        List<RefundRequest> pending = refundRequestRepository.findAll();
        // Simple filter for PENDING items
        for (RefundRequest r : pending) {
            if (r.getStatus() == RefundStatus.PENDING) {
                try {
                    log.info("Worker picked refund {}", r.getId());
                    refundProcessor.process(r);
                } catch (Exception ex) {
                    log.error("Processing refund {} failed", r.getId(), ex);
                    r.setStatus(RefundStatus.FAILED);
                    refundRequestRepository.save(r);
                }
            }
        }
    }
}
