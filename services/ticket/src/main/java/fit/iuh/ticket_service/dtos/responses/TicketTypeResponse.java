package fit.iuh.ticket_service.dtos.responses;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TicketTypeResponse {
    private Long id;
    private Long performanceId;
    private String name;
    private BigDecimal price;
    private Integer totalQuantity;
    private Integer soldQuantity;
    private Integer reservedQuantity;
    private Integer maxTicketsPerUser;
    private Long version;
}
