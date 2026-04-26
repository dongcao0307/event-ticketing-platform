package fit.iuh.booking_service.exceptions;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    BOOKING_NOT_FOUND("Booking not found", HttpStatus.NOT_FOUND),
    BOOKING_ITEM_NOT_FOUND("Booking item not found", HttpStatus.NOT_FOUND),
    INVALID_POST_REQUEST("Invalid post request", HttpStatus.BAD_REQUEST),
    BOOKING_NOT_PENDING("Booking is not in PENDING status", HttpStatus.BAD_REQUEST),
    UNCATEGORIZED_EXCEPTION("Uncategorized Exception", HttpStatus.INTERNAL_SERVER_ERROR),
    ;

    private final String message;
    private final HttpStatus httpStatus;
}
