package fit.iuh.ticket_service.dtos.responses;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
    private Integer minTicketsPerUser;
    private LocalDateTime sellFrom;
    private LocalDateTime sellTo;
    private String description;
    private String imageUrl;
    private Long version;
}
