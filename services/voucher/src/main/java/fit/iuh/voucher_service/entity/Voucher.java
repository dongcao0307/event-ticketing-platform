package fit.iuh.voucher_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "vouchers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String code;

    @Column(name = "campaign_name", nullable = false)
    private String campaignName;

    @Column(name = "discount_value", nullable = false, precision = 15, scale = 2)
    private BigDecimal discountValue;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    // QUAN TRỌNG: Dùng cho tính năng Xóa mềm (Soft Delete)
    @Column(name = "is_active")
    private Boolean isActive;

    // QUAN TRỌNG: Khóa lạc quan chống tranh chấp khi áp mã
    @Version
    private Integer version;

    // Các trường quan hệ (Tạm dùng ID thay vì bảng riêng để đơn giản hóa giai đoạn 1)
    @Column(name = "discount_type")
    private String discountType; // FIXED_AMOUNT hoặc PERCENTAGE

    @Column(name = "organizer_id")
    private Long organizerId; // ID của người tạo mã
}