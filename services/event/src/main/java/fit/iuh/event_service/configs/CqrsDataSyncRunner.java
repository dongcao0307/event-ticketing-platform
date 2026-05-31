package fit.iuh.event_service.configs;

import fit.iuh.event_service.models.*;
import fit.iuh.event_service.models.enums.EventCategory;
import fit.iuh.event_service.models.enums.EventStatus;
import fit.iuh.event_service.repositories.EventRepository;
import fit.iuh.event_service.repositories.TicketTypeRepository;
import fit.iuh.event_service.repositories.mongo.EventDocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class CqrsDataSyncRunner implements CommandLineRunner {

    private final EventRepository eventRepository;
    private final EventDocumentRepository eventDocumentRepository;
    private final TicketTypeRepository ticketTypeRepository;

    @Override
    public void run(String... args) throws Exception {
        long count = eventDocumentRepository.count();
        if (count == 0) {
            log.info("[CQRS-SYNC] MongoDB read model is empty. Auto-syncing data from MySQL...");
            System.out.println("[CQRS-SYNC] MongoDB read model is empty. Auto-syncing data from MySQL...");
            
            List<Event> mysqlEvents = eventRepository.findAll();
            
            List<EventDocument> mongoDocs = mysqlEvents.stream()
                    .map(this::mapToEventDocument)
                    .collect(Collectors.toList());
                    
            eventDocumentRepository.saveAll(mongoDocs);
            
            log.info("[CQRS-SYNC] Successfully auto-synced {} events to MongoDB.", mongoDocs.size());
            System.out.println("[CQRS-SYNC] Successfully auto-synced " + mongoDocs.size() + " events to MongoDB.");
        } else {
            log.info("[CQRS-SYNC] MongoDB already contains data. Skipping auto-sync.");
            System.out.println("[CQRS-SYNC] MongoDB already contains data. Skipping auto-sync.");
        }
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
            List<TicketType> ticketTypeList = perf.getTickets();
            if (ticketTypeList == null || ticketTypeList.isEmpty()) {
                try {
                    ticketTypeList = ticketTypeRepository.findByPerformanceId(perf.getId());
                } catch (Exception e) {
                    log.error("Failed to fetch tickets for performance ID: " + perf.getId(), e);
                }
            }
            if (ticketTypeList == null) {
                ticketTypeList = new ArrayList<>();
            }

            List<EventDocument.TicketTypeDocument> tickets = ticketTypeList.stream().map(ticket -> EventDocument.TicketTypeDocument.builder()
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
