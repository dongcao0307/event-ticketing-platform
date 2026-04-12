package fit.iuh.event_service.dto;

import fit.iuh.event_service.entity.Event;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {

    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private String category;
    private String location;
    private String city;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String formattedDate;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private String priceDisplay;
    private Integer totalTickets;
    private Integer availableTickets;
    private String status;
    private String organizerName;
    private String organizerLogo;
    private Boolean isFeatured;
    private Integer viewCount;

    public static EventResponse fromEntity(Event event) {
        String priceDisplay = "Miễn phí";
        if (event.getMinPrice() != null && event.getMinPrice().compareTo(BigDecimal.ZERO) > 0) {
            priceDisplay = "Từ " + String.format("%,.0f", event.getMinPrice()) + "đ";
        }

        String formattedDate = "";
        if (event.getStartTime() != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd 'tháng' MM, yyyy");
            formattedDate = event.getStartTime().format(formatter);
        }

        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .imageUrl(event.getImageUrl())
                .category(event.getCategory() != null ? event.getCategory().name() : null)
                .location(event.getLocation())
                .city(event.getCity())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .formattedDate(formattedDate)
                .minPrice(event.getMinPrice())
                .maxPrice(event.getMaxPrice())
                .priceDisplay(priceDisplay)
                .totalTickets(event.getTotalTickets())
                .availableTickets(event.getAvailableTickets())
                .status(event.getStatus() != null ? event.getStatus().name() : null)
                .organizerName(event.getOrganizerName())
                .organizerLogo(event.getOrganizerLogo())
                .isFeatured(event.getIsFeatured())
                .viewCount(event.getViewCount())
                .build();
    }
}
