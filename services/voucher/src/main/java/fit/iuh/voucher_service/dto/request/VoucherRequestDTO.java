package fit.iuh.voucher_service.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class VoucherRequestDTO {

    @NotBlank(message = "Mã voucher không được để trống")
    private String code;

    @NotBlank(message = "Tên chiến dịch không được để trống")
    private String campaignName;

    @NotNull(message = "Giá trị giảm không được để trống")
    @Positive(message = "Giá trị giảm phải lớn hơn 0")
    private BigDecimal discountValue;

    private String discountType;

    @NotNull(message = "Ngày bắt đầu là bắt buộc")
    private LocalDateTime startDate;

    @NotNull(message = "Ngày kết thúc là bắt buộc")
    private LocalDateTime endDate;
}