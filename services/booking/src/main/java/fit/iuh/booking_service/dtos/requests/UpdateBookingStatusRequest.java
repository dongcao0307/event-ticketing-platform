package fit.iuh.booking_service.dtos.requests;

import fit.iuh.booking_service.entities.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateBookingStatusRequest {
    @NotNull(message = "status must not be null")
    private BookingStatus status;
}
