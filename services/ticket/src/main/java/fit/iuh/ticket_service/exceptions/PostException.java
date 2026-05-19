package fit.iuh.ticket_service.exceptions;

import jakarta.validation.ConstraintViolation;
import lombok.Getter;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

@Getter
public class PostException extends AppException {
    private Map<String, String> errors;
    public PostException(Set<? extends ConstraintViolation<?>> violations) {
        super(ErrorCode.INVALID_POST_REQUEST);
        setErrors(violations, null);
    }

    public PostException(Set<? extends ConstraintViolation<?>> violations, Map<String, String> others) {
        super(ErrorCode.INVALID_POST_REQUEST);
        setErrors(violations, others);
    }

    // Sử dụng wildcard '?' cho kiểu dữ liệu không xác định
    private void setErrors(Set<? extends ConstraintViolation<?>> violations, Map<String, String> others) {
        errors = new LinkedHashMap<String, String>();
        for (ConstraintViolation<?> violation : violations) {
            errors.put(violation.getPropertyPath().toString(), violation.getMessage());
        }
        if (others != null) {
            errors.putAll(others);
        }
    }
}
