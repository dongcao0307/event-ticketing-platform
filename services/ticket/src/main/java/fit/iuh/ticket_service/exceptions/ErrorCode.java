package fit.iuh.ticket_service.exceptions;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    TICKET_TYPE_NOT_FOUND("Ticket type not found", HttpStatus.NOT_FOUND),
    TICKET_NOT_FOUND("Ticket not found", HttpStatus.NOT_FOUND),
    UNCATEGORIZED_EXCEPTION("Uncategorized Exception", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_POST_REQUEST("Invalid post request", HttpStatus.BAD_REQUEST),
    CAN_NOT_CHANGE_ACTIVE_ADMIN("Can not change active admin", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED_ACCESS("Unauthorized access", HttpStatus.UNAUTHORIZED),
    ;

    private final String message;
    private final HttpStatus httpStatus;
}
