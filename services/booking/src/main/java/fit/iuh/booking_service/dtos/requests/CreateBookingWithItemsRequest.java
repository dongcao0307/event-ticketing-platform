package fit.iuh.booking_service.dtos.requests;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateBookingWithItemsRequest {
    @NotNull(message = "userId must not be null")
    private Long userId;

    @NotBlank(message = "idempotenceKey must not be blank")
    @Size(max = 80, message = "idempotenceKey max length is 80")
    private String idempotenceKey;

    @Builder.Default
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @NotEmpty(message = "items must not be empty")
    @Valid
    private List<AddBookingItemRequest> items;
}