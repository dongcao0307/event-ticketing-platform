package fit.iuh.payment_service.exceptions;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    INVALID_POST_REQUEST("Invalid post request", HttpStatus.BAD_REQUEST),
    PAYMENT_NOT_FOUND("Payment not found", HttpStatus.NOT_FOUND),
    PAYMENT_METHOD_NOT_AVAILABLE("Payment method is not available", HttpStatus.BAD_REQUEST),
    INVALID_SIGNATURE("Invalid webhook signature", HttpStatus.UNAUTHORIZED),
    DUPLICATE_PROVIDER_TRANSACTION_ID("Duplicated provider transaction id", HttpStatus.CONFLICT),
    INVALID_PAYMENT_STATUS("Invalid payment status", HttpStatus.BAD_REQUEST),
    UNCATEGORIZED_EXCEPTION("Uncategorized exception", HttpStatus.INTERNAL_SERVER_ERROR);

    private final String message;
    private final HttpStatus httpStatus;
}
