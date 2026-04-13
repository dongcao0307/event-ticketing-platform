package fit.iuh.ticket_service.dtos.requests;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import org.hibernate.validator.constraints.Length;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TicketTypeBulkWriteRequest {
    @PositiveOrZero(message = "id must be greater than or equal 0")
    private Long id;
    @PositiveOrZero(message = "performance id must be greater than or equal 0")
    private Long performanceId;
    @Length(min = 1, max = 50, message = "name must not null and its length is smaller than or equal 50")
    private String name;
    @PositiveOrZero(message = "price must be greater than or equal 0")
    private BigDecimal price;
    @Positive(message = "total quantity must be greater than 0")
    private Integer totalQuantity;
    @PositiveOrZero(message = "sold quantity must be greater than or equal 0")
    private Integer soldQuantity;
    @PositiveOrZero(message = "reserved quantity must be greater than or equal 0")
    private Integer reservedQuantity;
    @Positive(message = "max tickets per user must be greater than 0")
    private Integer maxTicketsPerUser;
    private Long version;
}

