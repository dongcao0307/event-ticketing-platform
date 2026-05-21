package fit.iuh.notification_service.services;

import fit.iuh.notification_service.entities.NotificationLog;
import fit.iuh.notification_service.entities.NotificationLogStatus;
import fit.iuh.notification_service.entities.NotificationTemplate;
import fit.iuh.notification_service.repositories.NotificationLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationLogService {
    private final NotificationLogRepository logRepository;

    public NotificationLog createLog(String recipient, NotificationTemplate template, Map<String, Object> data) {
        NotificationLog log = NotificationLog.builder()
                .recipientEmail(recipient)
                .retryCount(0)
                .status(NotificationLogStatus.RETRYING)
                .template(template)
                .dataJson(data)
                .build();
        return logRepository.save(log);
    }

    public NotificationLog markSent(NotificationLog log) {
        log.setStatus(NotificationLogStatus.SENT);
        log.setSentAt(LocalDateTime.now());
        return logRepository.save(log);
    }

    public NotificationLog markFailed(NotificationLog log) {
        log.setStatus(NotificationLogStatus.FAILED);
        return logRepository.save(log);
    }

    public NotificationLog incrementRetry(NotificationLog log) {
        Integer current = log.getRetryCount() == null ? 0 : log.getRetryCount();
        log.setRetryCount(current + 1);
        log.setStatus(NotificationLogStatus.RETRYING);
        return logRepository.save(log);
    }
}
