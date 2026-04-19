package fit.iuh.event_service.feature.admin_event.dto;

import fit.iuh.event_service.entity.EventStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventAdminDetailDTO {
    private Long id;
    private String eventId; // EVT-2024-001
    private String title;
    private String description;
    private EventStatus status;
    private String category;
    private String type; // Offline/Online
    
    // Time & Location
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime startDate;
    @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime endDate;
    private String location;
    
    // Organizer Info
    private OrganizerInfoDTO organizer;
    
    // Tickets
    private List<TicketTypeDTO> tickets;
    
    // Stats
    private Integer totalTickets;
    private Integer ticketsSold;
    private Long totalRevenue;
    private Long viewCount;
    
    // Meta
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDateTime createdAt;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDateTime updatedAt;
    private String eventUrl;
    private String privacy;
    private String accessNotes;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrganizerInfoDTO {
        private Long id;
        private String name;
        private String email;
        private String phone;
        private String description;
        private String bankAccountName;
        private String bankAccountNumber;
        private String bankName;
        private String businessType;
        private String taxId;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TicketTypeDTO {
        private String type;
        private Integer quantity;
        private Long price;
        private Integer sold;
    }
}
