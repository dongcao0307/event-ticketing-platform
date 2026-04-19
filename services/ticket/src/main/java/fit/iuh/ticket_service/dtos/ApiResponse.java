package fit.iuh.ticket_service.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.Instant;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    @Builder.Default
    private Instant timestamp = Instant.now();
    @Builder.Default
    private int status = 200;
    private T body;
    private String message;
    private Map<String, String> errors;
}
