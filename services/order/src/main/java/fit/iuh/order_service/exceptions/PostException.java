package fit.iuh.order_service.exceptions;

import jakarta.validation.ConstraintViolation;
import lombok.Getter;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

@Getter
public class PostException extends RuntimeException {
    private final ErrorCode errorCode = ErrorCode.INVALID_POST_REQUEST;
    private final Map<String, String> errors;

    public PostException(Set<? extends ConstraintViolation<?>> violations) {
        Map<String, String> map = new LinkedHashMap<>();
        for (ConstraintViolation<?> v : violations) {
            map.put(v.getPropertyPath().toString(), v.getMessage());
        }
        this.errors = map;
    }

    public PostException(Set<? extends ConstraintViolation<?>> violations, Map<String, String> additionalErrors) {
        Map<String, String> map = new LinkedHashMap<>();
        for (ConstraintViolation<?> v : violations) {
            map.put(v.getPropertyPath().toString(), v.getMessage());
        }
        if (additionalErrors != null) {
            map.putAll(additionalErrors);
        }
        this.errors = map;
    }
}
