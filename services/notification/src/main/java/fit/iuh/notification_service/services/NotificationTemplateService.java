package fit.iuh.notification_service.services;

import fit.iuh.notification_service.entities.NotificationTemplate;
import fit.iuh.notification_service.entities.NotificationTemplateType;
import fit.iuh.notification_service.exceptions.AppException;
import fit.iuh.notification_service.exceptions.ErrorCode;
import fit.iuh.notification_service.repositories.NotificationTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationTemplateService {
    private final NotificationTemplateRepository templateRepository;

    public NotificationTemplate findByType(NotificationTemplateType type) {
        return templateRepository.findByTemplateType(type)
                .orElseThrow(() -> new AppException(ErrorCode.TEMPLATE_NOT_FOUND, "Template not found: " + type));
    }
}
