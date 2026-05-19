package fit.iuh.notification_service.services;

import fit.iuh.notification_service.entities.NotificationLog;
import fit.iuh.notification_service.entities.NotificationTemplate;
import fit.iuh.notification_service.exceptions.AppException;
import fit.iuh.notification_service.exceptions.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationEmailService {
    private static final int MAX_RETRIES = 3;

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final NotificationLogService logService;

    public void sendWithRetry(String recipientEmail, NotificationTemplate template, Map<String, Object> data) {
        if (recipientEmail == null || recipientEmail.isBlank()) {
            throw new AppException(ErrorCode.RECIPIENT_NOT_FOUND, "Recipient email missing");
        }

        NotificationLog logEntry = logService.createLog(recipientEmail, template, data);
        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                sendEmail(recipientEmail, template, data);
                logService.markSent(logEntry);
                return;
            } catch (Exception ex) {
                log.warn("Failed to send notification email attempt {}/{}", attempt, MAX_RETRIES, ex);
                logEntry = logService.incrementRetry(logEntry);
                if (attempt == MAX_RETRIES) {
                    logService.markFailed(logEntry);
                    throw new AppException(ErrorCode.EMAIL_SEND_FAILED, "Failed to send email after retries");
                }
            }
        }
    }

    private void sendEmail(String recipientEmail, NotificationTemplate template, Map<String, Object> data) throws Exception {
        Context context = new Context();
        context.setVariables(data);
        String html = templateEngine.process(template.getContent(), context);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                StandardCharsets.UTF_8.name());
        helper.setTo(recipientEmail);
        helper.setSubject(template.getTitle());
        helper.setText(html, true);
        mailSender.send(message);
    }
}
