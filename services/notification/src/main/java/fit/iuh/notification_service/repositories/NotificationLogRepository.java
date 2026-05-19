package fit.iuh.notification_service.repositories;

import fit.iuh.notification_service.entities.NotificationLog;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NotificationLogRepository extends MongoRepository<NotificationLog, String> {
}
