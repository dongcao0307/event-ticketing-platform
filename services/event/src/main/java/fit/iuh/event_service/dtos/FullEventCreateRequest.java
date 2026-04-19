package fit.iuh.event_service.dtos;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
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
    public static class PerformanceRequest {
        private String startTime;
        private String endTime;
        private List<TicketRequest> tickets;
    }

    @Data
    public static class TicketRequest {
        private String name;
        private BigDecimal price; // Đổi sang BigDecimal theo UML
        private Integer totalQuantity; // Bổ sung để khớp UML
        private Integer maxTicketsPerUser;
        private boolean isFree;
        private String saleStart;
        private String saleEnd;
    }

    // Class lồng hứng Cài đặt (Step 3)
    @Data
    public static class SettingsRequest {
        private String customUrl;
        private String privacy;
        private String confirmMsg;
        private boolean enableQuestionnaire;
    }

    // Class lồng hứng Thanh toán (Step 4) - Khớp với bảng OrganizerPaymentInfo
    @Data
    public static class PaymentInfoRequest {
        private String accountName; // Sẽ map vào accountOwner
        private String accountNumber;
        private String bankName;
        private String branch; // Sẽ map vào bankBranch
        private String businessType;
        private String fullName;
        private String address;
        private String taxCode;
    }
}