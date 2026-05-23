package fit.iuh.event_service.dtos;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
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
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class PerformanceRequest {
        @JsonSerialize(using = LocalDateTimeSerializer.class)
        @JsonDeserialize(using = LocalDateTimeDeserializer.class)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime startTime;

        @JsonSerialize(using = LocalDateTimeSerializer.class)
        @JsonDeserialize(using = LocalDateTimeDeserializer.class)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime endTime;

        private List<TicketRequest> tickets;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TicketRequest {
        private String name;
        private BigDecimal price;
        private Integer totalQuantity;
        private Integer maxTicketsPerUser;
        private Integer minTicketsPerUser;
        private boolean isFree;

        @JsonSerialize(using = LocalDateTimeSerializer.class)
        @JsonDeserialize(using = LocalDateTimeDeserializer.class)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime saleStart;

        @JsonSerialize(using = LocalDateTimeSerializer.class)
        @JsonDeserialize(using = LocalDateTimeDeserializer.class)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        private LocalDateTime saleEnd;
    }

    // Các class còn lại SettingsRequest và PaymentInfoRequest không có LocalDateTime nên giữ nguyên
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SettingsRequest {
        private String customUrl;
        private String privacy;
        private String confirmMsg;
        private boolean enableQuestionnaire;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
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