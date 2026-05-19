package fit.iuh.event_service.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime; // Thêm thư viện thời gian
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true) // ---> BẢO VỆ CLASS CHA
public class FullEventCreateRequest {
    // --- Step 1 Data ---
    private String title;
    private String description;
    private Long categoryId;
    private String thumbnailUrl;
    private String posterUrl;
    private String venueName;
    private String eventType;
    private String province;
    private String district;
    private String ward;
    private String street;
    private String organizerName;
    private String organizerLogo;
    private String organizerInfo;

    // --- Step 2, 3, 4 Data ---
    private List<PerformanceRequest> performances;
    private SettingsRequest settings;
    private PaymentInfoRequest paymentInfo;

    // Class lồng hứng Suất diễn & Vé
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true) // ---> BẢO VỆ CLASS SUẤT DIỄN
    public static class PerformanceRequest {

        private LocalDateTime startTime;

        private LocalDateTime endTime;

        private List<TicketRequest> tickets;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true) // ---> BẢO VỆ CLASS VÉ
    public static class TicketRequest {
        private String name;
        private BigDecimal price;
        private Integer totalQuantity;
        private Integer maxTicketsPerUser;
        private boolean isFree;

        private LocalDateTime saleStart;

        private LocalDateTime saleEnd;
    }

    // Class lồng hứng Cài đặt (Step 3)
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true) // ---> BẢO VỆ CÀI ĐẶT
    public static class SettingsRequest {
        private String customUrl;
        private String privacy;
        private String confirmMsg;
        private boolean enableQuestionnaire;
    }

    // Class lồng hứng Thanh toán (Step 4)
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true) // ---> BẢO VỆ THANH TOÁN
    public static class PaymentInfoRequest {
        private String accountName;
        private String accountNumber;
        private String bankName;
        private String branch;
        private String businessType;
        private String fullName;
        private String address;
        private String taxCode;
    }
}