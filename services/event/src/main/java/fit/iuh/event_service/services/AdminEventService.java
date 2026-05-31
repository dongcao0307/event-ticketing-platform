package fit.iuh.event_service.services;

import fit.iuh.event_service.models.Event;
import fit.iuh.event_service.models.EventPerformance;
import fit.iuh.event_service.models.enums.EventStatus;
import fit.iuh.event_service.dtos.EventAdminDetailDTO;
import fit.iuh.event_service.dtos.EventAdminListDTO;
import fit.iuh.event_service.repositories.EventRepository;
import fit.iuh.event_service.repositories.EventPerformanceRepository;
import fit.iuh.event_service.models.TicketType;
import fit.iuh.event_service.models.OrganizerPaymentInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import fit.iuh.event_service.events.EventUpdatedEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AdminEventService {
    private final EventRepository eventRepository;
    private final EventPerformanceRepository performanceRepository;
    private final ApplicationEventPublisher eventPublisher;

    /**
     * Lấy danh sách events theo trạng thái
     */
    public List<EventAdminListDTO> getEventsByStatus(EventStatus status) {
        log.info("Fetching events with status: {}", status);
        List<Event> events = status == null
                ? eventRepository.findAll()
                : eventRepository.findByStatus(status);
        return events.stream()
                .map(this::convertToListDTO)
                .collect(Collectors.toList());
    }

    /**
     * Lấy chi tiết sự kiện
     */
    public EventAdminDetailDTO getEventDetail(Long eventId) {
        log.info("Fetching event detail: {}", eventId);
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found: " + eventId));
        return convertToDetailDTO(event);
    }

    /**
     * Duyệt sự kiện
     */
    public EventAdminDetailDTO approveEvent(Long eventId) {
        log.info("Approving event: {}", eventId);
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found: " + eventId));

        if (event.getStatus() != EventStatus.DRAFT && event.getStatus() != EventStatus.PENDING) {
            throw new RuntimeException("Only DRAFT or PENDING events can be approved");
        }

        event.setStatus(EventStatus.PUBLISHED);
        Event saved = eventRepository.saveAndFlush(event);

        // 🔥 CHÈN VŨ KHÍ TỰ ĐỘNG ĐỒNG BỘ GIÁ VÀO ĐÂY:
        // Ngay khi bấm Duyệt, Backend tự động lội xuống tính MIN/MAX từ bảng vé và đồng bộ ra Home!
        eventRepository.syncPriceOnApproval(eventId);

        Event updatedEvent = eventRepository.findById(eventId).orElse(saved);
        System.out.println("[CQRS-WRITE] Event saved to MySQL. Publishing sync event...");
        eventPublisher.publishEvent(new EventUpdatedEvent(updatedEvent));

        log.info("Event approved successfully and price synced: {}", eventId);
        return convertToDetailDTO(updatedEvent);
    }

    /**
     * Từ chối sự kiện
     */
    public EventAdminDetailDTO rejectEvent(Long eventId, String reason) {
        log.info("Rejecting event: {}, reason: {}", eventId, reason);
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found: " + eventId));

        if (event.getStatus() != EventStatus.DRAFT && event.getStatus() != EventStatus.PENDING) {
            throw new RuntimeException("Only DRAFT or PENDING events can be rejected");
        }

        event.setStatus(EventStatus.CANCELLED);
        Event saved = eventRepository.save(event);
        System.out.println("[CQRS-WRITE] Event saved to MySQL. Publishing sync event...");
        eventPublisher.publishEvent(new EventUpdatedEvent(saved));
        log.info("Event rejected successfully: {}", eventId);
        return convertToDetailDTO(saved);
    }

    /**
     * Khóa sự kiện (CANCEL)
     */
    public EventAdminDetailDTO lockEvent(Long eventId, String reason) {
        log.info("Locking event: {}, reason: {}", eventId, reason);
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found: " + eventId));

        event.setStatus(EventStatus.CANCELLED);
        Event saved = eventRepository.save(event);
        System.out.println("[CQRS-WRITE] Event saved to MySQL. Publishing sync event...");
        eventPublisher.publishEvent(new EventUpdatedEvent(saved));
        log.info("Event locked successfully: {}", eventId);
        return convertToDetailDTO(saved);
    }

    /**
     * Search events theo tiêu đề hoặc organizer
     */
    public List<EventAdminListDTO> searchEvents(String query, EventStatus status) {
        log.info("Searching events with query: {}, status: {}", query, status);
        List<Event> allEvents = status == null
                ? eventRepository.findAll()
                : eventRepository.findByStatus(status);

        return allEvents.stream()
                .filter(e -> e.getTitle().toLowerCase().contains(query.toLowerCase()))
                .map(this::convertToListDTO)
                .collect(Collectors.toList());
    }

    // Helper methods
    private EventAdminListDTO convertToListDTO(Event event) {
        return EventAdminListDTO.builder()
                .id(event.getId())
                .title(event.getTitle())
                .organizerId(event.getOrganizerId())
                .organizerName(event.getOrganizerName())
                .category(getCategoryName(event.getCategoryId()))
                .type(event.getVenue() != null ? "Offline" : "Online")
                .eventDate(event.getStartTime())
                .createdAt(event.getCreatedAt())
                .status(event.getStatus())
                .thumbnailUrl(event.getThumbnailUrl())
                .build();
    }

    private EventAdminDetailDTO convertToDetailDTO(Event event) {
        String location = "Online";
        java.time.LocalDateTime startDate = null;
        java.time.LocalDateTime endDate = null;

        if (event.getVenue() != null) {
            location = event.getVenue().getName();
        }

        List<EventPerformance> performances = performanceRepository.findByEventId(event.getId());
        if (!performances.isEmpty()) {
            EventPerformance perf = performances.get(0);
            startDate = perf.getStartTime();
            endDate = perf.getEndTime();
            if (perf.getVenue() != null) {
                location = perf.getVenue().getName();
            }
        }

        // Map organizer details
        EventAdminDetailDTO.OrganizerInfoDTO organizerDTO = EventAdminDetailDTO.OrganizerInfoDTO.builder()
                .id(event.getOrganizerId())
                .name(event.getOrganizerName())
                .description(event.getOrganizerInfo())
                .logo(event.getOrganizerLogo())
                .build();

        OrganizerPaymentInfo payment = event.getPaymentInfo();
        if (payment != null) {
            organizerDTO.setBankAccountName(payment.getAccountOwner());
            organizerDTO.setBankAccountNumber(payment.getAccountNumber());
            organizerDTO.setBankName(payment.getBankName());
            organizerDTO.setTaxId(payment.getTaxCode());
        }

        // Map tickets and compute statistics
        List<EventAdminDetailDTO.TicketTypeDTO> ticketDTOs = new ArrayList<>();
        int totalTickets = 0;
        int ticketsSold = 0;
        long totalRevenue = 0;
        for (EventPerformance perf : performances) {
            if (perf.getTickets() != null) {
                for (TicketType ticket : perf.getTickets()) {
                    ticketDTOs.add(EventAdminDetailDTO.TicketTypeDTO.builder()
                            .type(ticket.getName())
                            .quantity(ticket.getTotalQuantity())
                            .price(ticket.getPrice() != null ? ticket.getPrice().longValue() : 0L)
                            .sold(ticket.getSoldQuantity())
                            .build());
                    totalTickets += ticket.getTotalQuantity() != null ? ticket.getTotalQuantity() : 0;
                    ticketsSold += ticket.getSoldQuantity() != null ? ticket.getSoldQuantity() : 0;
                    totalRevenue += (ticket.getPrice() != null && ticket.getSoldQuantity() != null)
                            ? ticket.getPrice().longValue() * ticket.getSoldQuantity()
                            : 0L;
                }
            }
        }

        return EventAdminDetailDTO.builder()
                .id(event.getId())
                .eventId("EVT-" + event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .status(event.getStatus())
                .category(getCategoryName(event.getCategoryId()))
                .type(event.getVenue() != null ? "Offline" : "Online")
                .startDate(startDate)
                .endDate(endDate)
                .location(location)
                .thumbnailUrl(event.getThumbnailUrl())
                .posterUrl(event.getPosterUrl())
                .organizer(organizerDTO)
                .tickets(ticketDTOs)
                .totalTickets(totalTickets)
                .ticketsSold(ticketsSold)
                .totalRevenue(totalRevenue)
                .viewCount(event.getViewCount() != null ? event.getViewCount().longValue() : 0L)
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .eventUrl("https://ticketbox.vn/events/" + event.getId())
                .privacy("Public")
                .accessNotes("Open to all")
                .build();
    }

    private String getCategoryName(Long categoryId) {
        if (categoryId == null) return "Khác";
        return switch (categoryId.intValue()) {
            case 1 -> "Sân khấu & Nghệ thuật";
            case 2 -> "Nhạc sống";
            case 3 -> "Thể thao";
            case 4 -> "Workshop";
            case 5 -> "Festival / Lễ hội";
            case 6 -> "Hài kịch";
            case 7 -> "Triển lãm";
            default -> "Khác";
        };
    }
}