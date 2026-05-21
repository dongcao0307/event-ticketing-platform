package fit.iuh.notification_service.controllers;

import fit.iuh.notification_service.entities.NotificationLog;
import fit.iuh.notification_service.entities.NotificationTemplate;
import fit.iuh.notification_service.repositories.NotificationLogRepository;
import fit.iuh.notification_service.repositories.NotificationTemplateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationAdminController {
    private final NotificationTemplateRepository templateRepository;
    private final NotificationLogRepository logRepository;

    @GetMapping("/templates")
    public List<NotificationTemplate> getTemplates() {
        return templateRepository.findAll();
    }

    @GetMapping("/logs")
    public List<NotificationLog> getLogs() {
        return logRepository.findAll();
    }
}
