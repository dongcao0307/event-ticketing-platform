package fit.iuh.event_service.listeners;

import fit.iuh.event_service.events.EventCreatedEvent;
import fit.iuh.event_service.events.EventUpdatedEvent;
import fit.iuh.event_service.models.*;
import fit.iuh.event_service.repositories.EventRepository;
import fit.iuh.event_service.repositories.TicketTypeRepository;
import fit.iuh.event_service.repositories.mongo.EventDocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class CqrsEventListener {

    private final EventDocumentRepository eventDocumentRepository;
    private final EventRepository eventRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final RedisTemplate<String, Object> redisTemplate;

    @Async
    @EventListener
    public void handleEventCreated(EventCreatedEvent event) {
        log.info("[CQRS-SYNC] Event caught. Updating Read Model in MongoDB...");
        System.out.println("[CQRS-SYNC] Event caught. Updating Read Model in MongoDB...");
        saveOrUpdateReadModel(event.getEvent());
    }

    @Async
    @EventListener
    public void handleEventUpdated(EventUpdatedEvent event) {
        log.info("[CQRS-SYNC] Event caught. Updating Read Model in MongoDB...");
        System.out.println("[CQRS-SYNC] Event caught. Updating Read Model in MongoDB...");
        saveOrUpdateReadModel(event.getEvent());
    }

    private void saveOrUpdateReadModel(Event eventArg) {
        if (eventArg == null || eventArg.getId() == null) return;
        
        // Fetch full event from MySQL with performances and venue
        Event event = eventRepository.findFullEventById(eventArg.getId()).orElse(eventArg);
        
        EventDocument doc = EventDocument.builder()
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

        eventDocumentRepository.save(doc);
        
        try {
            String redisKey = "event:detail:" + event.getId();
            redisTemplate.delete(redisKey);
            log.info("[REDIS] Cache evicted for event {} due to update.", event.getId());
            System.out.println("[REDIS] Cache evicted for event " + event.getId() + " due to update.");
        } catch (Exception e) {
            log.error("Failed to evict Redis cache for event ID: " + event.getId(), e);
        }
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
