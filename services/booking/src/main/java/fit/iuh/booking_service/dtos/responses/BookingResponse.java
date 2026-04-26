package fit.iuh.booking_service.dtos.responses;

import fit.iuh.booking_service.entities.BookingStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {
    private Long id;
    private Long userId;
    private String idempotenceKey;
    private BigDecimal subtotal;
    private BigDecimal discountAmount;
    private BigDecimal totalAmount;
    private BookingStatus status;
    private LocalDateTime expiredAt;
    private LocalDateTime createdAt;
    private Long version;
    private List<BookingItemResponse> items;
}
