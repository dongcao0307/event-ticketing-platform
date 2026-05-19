package fit.iuh.notification_service.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "notification_templates")
public class NotificationTemplate {
    @Id
    private String templateId;
    private String title;
    private NotificationTemplateType templateType;
    private String content;
}
