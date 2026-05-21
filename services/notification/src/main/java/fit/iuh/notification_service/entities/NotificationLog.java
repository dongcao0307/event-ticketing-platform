package fit.iuh.notification_service.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "notification_logs")
public class NotificationLog {
    @Id
    private String logId;
    private String recipientEmail;
    private LocalDateTime sentAt;
    private Integer retryCount;
    private NotificationLogStatus status;
    private NotificationTemplate template;
    private Map<String, Object> dataJson;
}
