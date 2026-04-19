package fit.iuh.event_service.models;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "ticket_types")
public class TicketType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "performance_id")
    private Long performanceId;

    private String name;
    private BigDecimal price;

    private Integer totalQuantity;
    private Integer soldQuantity = 0; // Mặc định là 0 khi mới tạo
    private Integer reservedQuantity = 0; // Mặc định là 0
    private Integer maxTicketsPerUser;
    @Column(name = "sale_start")
    private String saleStart; // Có thể dùng LocalDateTime nếu bạn muốn parse

    @Column(name = "sale_end")
    private String saleEnd;

    @Version
    private Long version; // Khớp với UML dùng để Lock Optimistic
}