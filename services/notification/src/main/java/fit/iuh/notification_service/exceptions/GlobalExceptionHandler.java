package fit.iuh.notification_service.exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AppException.class)
    public ResponseEntity<Map<String, String>> handleAppException(AppException ex) {
        return ResponseEntity.badRequest().body(Map.of(
                "error", ex.getErrorCode().name(),
                "message", ex.getMessage()
        ));
    }
}
