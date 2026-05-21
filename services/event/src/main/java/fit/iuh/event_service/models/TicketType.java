package fit.iuh.event_service.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.ColumnDefault;

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
    @ColumnDefault("0")
    private Integer soldQuantity = 0; // Mặc định là 0 khi mới tạo
    @ColumnDefault("0")
    private Integer reservedQuantity = 0; // Mặc định là 0
    private Integer maxTicketsPerUser;

    // --- ĐỊNH DẠNG THỜI GIAN (ĐÃ ỐP BÙA JSON) ---
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(name = "sale_start")
    private LocalDateTime saleStart;

    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @JsonDeserialize(using = LocalDateTimeDeserializer.class)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(name = "sale_end")
    private LocalDateTime saleEnd;

    @Version
    private Long version; // Khớp với UML dùng để Lock Optimistic
}