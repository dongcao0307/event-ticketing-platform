package fit.iuh.event_service.models;

import fit.iuh.event_service.models.enums.EventCategory;
import fit.iuh.event_service.models.enums.EventStatus;
import fit.iuh.event_service.models.enums.PerformanceStatus;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "EventDocument")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventDocument {
    @Id
    private String id; // String MongoDB Id mapping to MySQL Event ID

    private Long mysqlId;
    private String title;
    private String description;
    private Long organizerId;
    private Long categoryId;
    private EventCategory category;
    private EventStatus status;
    private String settingsConfig;
    private String thumbnailUrl;
    private String posterUrl;
    private String imageUrl;
    private String organizerName;
    private String organizerLogo;
    private String organizerInfo;
    private String location;
    private String city;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Integer totalTickets;
    private Integer availableTickets;
    private Boolean isFeatured;
    private Integer viewCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<PerformanceDocument> performances;
    private PaymentInfoDocument paymentInfo;
    private VenueDocument venue;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PerformanceDocument {
        private Long id;
        private LocalDateTime startTime;
        private LocalDateTime endTime;
        private Integer totalCapacity;
        private Integer availableCapacity;
        private PerformanceStatus status;
        private VenueDocument venue;
        private List<TicketTypeDocument> tickets;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TicketTypeDocument {
        private Long id;
        private Long performanceId;
        private String name;
        private BigDecimal price;
        private Integer totalQuantity;
        private Integer soldQuantity;
        private Integer reservedQuantity;
        private Integer minTicketsPerUser;
        private Integer maxTicketsPerUser;
        private LocalDateTime saleStart;
        private LocalDateTime saleEnd;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VenueDocument {
        private Long id;
        private String name;
        private String address;
        private String city;
        private String seatMapConfig;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PaymentInfoDocument {
        private Long id;
        private String accountNumber;
        private String accountOwner;
        private String bankName;
        private String bankBranch;
        private String taxCode;
        private String address;
    }
}
