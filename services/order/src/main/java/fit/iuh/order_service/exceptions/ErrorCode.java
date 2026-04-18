package fit.iuh.order_service.exceptions;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    ORDER_NOT_FOUND("Order not found", HttpStatus.NOT_FOUND),
    ORDER_ITEM_NOT_FOUND("Order item not found", HttpStatus.NOT_FOUND),
    INVALID_POST_REQUEST("Invalid post request", HttpStatus.BAD_REQUEST),
    ORDER_NOT_PENDING("Order is not in PENDING status", HttpStatus.BAD_REQUEST),
    UNCATEGORIZED_EXCEPTION("Uncategorized Exception", HttpStatus.INTERNAL_SERVER_ERROR),
    ;

    private final String message;
    private final HttpStatus httpStatus;
}
