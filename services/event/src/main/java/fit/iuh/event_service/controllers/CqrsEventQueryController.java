package fit.iuh.event_service.controllers;

import fit.iuh.event_service.models.*;
import fit.iuh.event_service.models.enums.EventCategory;
import fit.iuh.event_service.models.enums.EventStatus;
import fit.iuh.event_service.repositories.EventRepository;
import fit.iuh.event_service.repositories.mongo.EventDocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Slf4j
public class CqrsEventQueryController {

    private final EventDocumentRepository eventDocumentRepository;
    private final EventRepository eventRepository;

    @GetMapping({
        "/api/events/cqrs",
        "/events/cqrs",
        "/api/cqrs/public/events",
        "/cqrs/public/events",
        "/api/events/cqrs/public/events",
        "/events/cqrs/public/events"
    })
    public ResponseEntity<List<EventDocument>> getAllEvents(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long organizerId,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String category) {
        log.info("[CQRS-READ] Fetching event data ultra-fast from MongoDB.");
        System.out.println("[CQRS-READ] Fetching event data ultra-fast from MongoDB.");

        if (organizerId != null) {
            return ResponseEntity.ok(eventDocumentRepository.findByOrganizerId(organizerId));
        }

        if (keyword != null && !keyword.trim().isEmpty()) {
            return ResponseEntity.ok(eventDocumentRepository.searchByKeyword(keyword));
        }

        if (type != null && !type.trim().isEmpty()) {
            String lowerType = type.trim().toLowerCase();
            if ("featured".equals(lowerType)) {
                return ResponseEntity.ok(eventDocumentRepository.findByIsFeaturedTrueAndStatusOrderByStartTimeAsc(EventStatus.PUBLISHED));
            } else if ("trending".equals(lowerType)) {
                return ResponseEntity.ok(eventDocumentRepository.findTop10ByStatusOrderByViewCountDesc(EventStatus.PUBLISHED));
            } else if ("latest".equals(lowerType)) {
                return ResponseEntity.ok(eventDocumentRepository.findTop10ByStatusOrderByCreatedAtDesc(EventStatus.PUBLISHED));
            }
        }

        if (category != null && !category.trim().isEmpty()) {
            try {
                EventCategory eventCategory = EventCategory.valueOf(category.trim().toUpperCase());
                return ResponseEntity.ok(eventDocumentRepository.findByCategoryAndStatusOrderByStartTimeAsc(eventCategory, EventStatus.PUBLISHED));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.ok(List.of());
            }
        }

        return ResponseEntity.ok(eventDocumentRepository.findAll());
    }

    @GetMapping({
        "/api/events/cqrs/{id}",
        "/events/cqrs/{id}"
    })
    public ResponseEntity<EventDocument> getEventById(@PathVariable String id) {
        log.info("[CQRS-READ] Fetching event data ultra-fast from MongoDB.");
        System.out.println("[CQRS-READ] Fetching event data ultra-fast from MongoDB.");

        return eventDocumentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping({
        "/api/events/cqrs/sync-all",
        "/events/cqrs/sync-all",
        "/api/cqrs/public/sync-all",
        "/cqrs/public/sync-all"
    })
    public ResponseEntity<String> syncAllEvents() {
        log.info("[CQRS-SYNC] Manual sync triggered. Fetching all events from MySQL...");
        System.out.println("[CQRS-SYNC] Manual sync triggered. Fetching all events from MySQL...");
        
        List<Event> mysqlEvents = eventRepository.findAll();
        
        List<EventDocument> mongoDocs = mysqlEvents.stream()
                .map(this::mapToEventDocument)
                .collect(Collectors.toList());
                
        eventDocumentRepository.saveAll(mongoDocs);
        
        String msg = "Successfully synced " + mongoDocs.size() + " events to MongoDB read model.";
        log.info("[CQRS-SYNC] " + msg);
        System.out.println("[CQRS-SYNC] " + msg);
        
        return ResponseEntity.ok(msg);
    }

    private EventDocument mapToEventDocument(Event event) {
        if (event == null || event.getId() == null) return null;
        
        return EventDocument.builder()
                .id(event.getId().toString())
                .mysqlId(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .organizerId(event.getOrganizerId())
                .categoryId(event.getCategoryId())
                .category(event.getCategory())
                .status(event.getStatus())
                .settingsConfig(event.getSettingsConfig())
                .thumbnailUrl(event.getThumbnailUrl())
                .posterUrl(event.getPosterUrl())
                .imageUrl(event.getImageUrl())
                .organizerName(event.getOrganizerName())
                .organizerLogo(event.getOrganizerLogo())
                .organizerInfo(event.getOrganizerInfo())
                .location(event.getLocation())
                .city(event.getCity())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .minPrice(event.getMinPrice())
                .maxPrice(event.getMaxPrice())
                .totalTickets(event.getTotalTickets())
                .availableTickets(event.getAvailableTickets())
                .isFeatured(event.getIsFeatured())
                .viewCount(event.getViewCount())
                .createdAt(event.getCreatedAt())
                .updatedAt(event.getUpdatedAt())
                .venue(event.getVenue() != null ? mapVenue(event.getVenue()) : null)
                .paymentInfo(event.getPaymentInfo() != null ? mapPayment(event.getPaymentInfo()) : null)
                .performances(mapPerformances(event.getPerformances()))
                .build();
    }

    private EventDocument.VenueDocument mapVenue(Venue venue) {
        return EventDocument.VenueDocument.builder()
                .id(venue.getId())
                .name(venue.getName())
                .address(venue.getAddress())
                .city(venue.getCity())
                .seatMapConfig(venue.getSeatMapConfig())
                .build();
    }

    private EventDocument.PaymentInfoDocument mapPayment(OrganizerPaymentInfo payment) {
        return EventDocument.PaymentInfoDocument.builder()
                .id(payment.getId())
                .accountNumber(payment.getAccountNumber())
                .accountOwner(payment.getAccountOwner())
                .bankName(payment.getBankName())
                .bankBranch(payment.getBankBranch())
                .taxCode(payment.getTaxCode())
                .address(payment.getAddress())
                .build();
    }

    private List<EventDocument.PerformanceDocument> mapPerformances(List<EventPerformance> performances) {
        if (performances == null) return new ArrayList<>();
        return performances.stream().map(perf -> {
            List<EventDocument.TicketTypeDocument> tickets = perf.getTickets() == null ? new ArrayList<>() :
                    perf.getTickets().stream().map(ticket -> EventDocument.TicketTypeDocument.builder()
                            .id(ticket.getId())
                            .performanceId(ticket.getPerformanceId())
                            .name(ticket.getName())
                            .price(ticket.getPrice())
                            .totalQuantity(ticket.getTotalQuantity())
                            .soldQuantity(ticket.getSoldQuantity())
                            .reservedQuantity(ticket.getReservedQuantity())
                            .minTicketsPerUser(ticket.getMinTicketsPerUser())
                            .maxTicketsPerUser(ticket.getMaxTicketsPerUser())
                            .saleStart(ticket.getSaleStart())
                            .saleEnd(ticket.getSaleEnd())
                            .build()
                    ).collect(Collectors.toList());

            return EventDocument.PerformanceDocument.builder()
                    .id(perf.getId())
                    .startTime(perf.getStartTime())
                    .endTime(perf.getEndTime())
                    .totalCapacity(perf.getTotalCapacity())
                    .availableCapacity(perf.getAvailableCapacity())
                    .status(perf.getStatus())
                    .venue(perf.getVenue() != null ? mapVenue(perf.getVenue()) : null)
                    .tickets(tickets)
                    .build();
        }).collect(Collectors.toList());
    }
}
