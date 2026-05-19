package fit.iuh.notification_service.repositories;

import fit.iuh.notification_service.entities.NotificationTemplate;
import fit.iuh.notification_service.entities.NotificationTemplateType;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface NotificationTemplateRepository extends MongoRepository<NotificationTemplate, String> {
    Optional<NotificationTemplate> findByTemplateType(NotificationTemplateType templateType);
}
