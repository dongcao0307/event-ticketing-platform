package fit.iuh.ticket_service.messaging;

import fit.iuh.ticket_service.dtos.requests.TicketCreateRequest;
import fit.iuh.ticket_service.entities.TicketType;
import fit.iuh.ticket_service.repositories.TicketRepository;
import fit.iuh.ticket_service.services.TicketService;
import fit.iuh.ticket_service.services.TicketTypeService;
import fit.iuh.ticket_service.outbox.TicketOutboxService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "booking.lifecycle.messaging", name = "enabled", havingValue = "true")
public class BookingCreatedListener {
    private final TicketService ticketService;
    private final TicketTypeService ticketTypeService;
    private final TicketRepository ticketRepository;
    private final TicketOutboxService ticketOutboxService;

    @RabbitListener(queues = "${booking.lifecycle.messaging.created-queue}")
    @Transactional
    public void onBookingCreated(BookingCreatedEvent event) {
        if (event == null || event.getBookingId() == null || event.getUserId() == null) {
            return;
        }

        List<BookingCreatedEvent.BookingCreatedItem> items = event.getItems();
        if (items == null || items.isEmpty()) {
            return;
        }

        long expectedCount = items.stream()
                .filter(item -> item != null && item.getQuantity() != null && item.getQuantity() > 0)
                .mapToLong(BookingCreatedEvent.BookingCreatedItem::getQuantity)
                .sum();

        if (expectedCount <= 0) {
            return;
        }

        long existingCount = ticketRepository.countByOrderId(event.getBookingId());
        if (existingCount >= expectedCount) {
            ticketOutboxService.enqueueTicketReserved(buildReservedEvent(event));
            return;
        }

        try {
            createMissingTickets(event, items);
            ticketOutboxService.enqueueTicketReserved(buildReservedEvent(event));
        } catch (Exception ex) {
            log.error("Failed to reserve tickets for booking {}", event.getBookingId(), ex);
            ticketOutboxService.enqueueTicketReservationFailed(buildFailedEvent(event, ex.getMessage()));
        }
    }

    private void createMissingTickets(BookingCreatedEvent event, List<BookingCreatedEvent.BookingCreatedItem> items) {
        for (BookingCreatedEvent.BookingCreatedItem item : items) {
            if (item == null || item.getTicketTypeId() == null || item.getQuantity() == null || item.getQuantity() <= 0) {
                continue;
            }

            long existingForType = ticketRepository.countByOrderIdAndTicketType_Id(event.getBookingId(), item.getTicketTypeId());
            int toCreate = (int) Math.max(0, item.getQuantity() - existingForType);
            if (toCreate <= 0) {
                continue;
            }

            TicketType ticketType = ticketTypeService.findByIdRaw(item.getTicketTypeId());
            List<TicketCreateRequest> requests = new ArrayList<>();

            for (int i = 0; i < toCreate; i++) {
                TicketCreateRequest request = new TicketCreateRequest();
                request.setTicketTypeId(item.getTicketTypeId());
                request.setPerformanceId(ticketType.getPerformanceId());
                request.setUserId(event.getUserId());
                request.setOrderId(event.getBookingId());
                request.setQrCode(buildQrCode(event.getBookingId(), item.getTicketTypeId()));
                request.setPriceAtPurchase(item.getUnitPrice() == null ? BigDecimal.ZERO : item.getUnitPrice());
                requests.add(request);
            }

            for (TicketCreateRequest request : requests) {
                ticketService.addTicket(request);
            }
        }
    }

    private TicketReservedEvent buildReservedEvent(BookingCreatedEvent event) {
        List<TicketReservedEvent.TicketReservedItem> reservedItems = new ArrayList<>();
        if (event.getItems() != null) {
            for (BookingCreatedEvent.BookingCreatedItem item : event.getItems()) {
                if (item == null) {
                    continue;
                }
                reservedItems.add(TicketReservedEvent.TicketReservedItem.builder()
                        .ticketTypeId(item.getTicketTypeId())
                        .quantity(item.getQuantity())
                        .build());
            }
        }

        return TicketReservedEvent.builder()
                .bookingId(event.getBookingId())
                .userId(event.getUserId())
                .reservedAt(LocalDateTime.now())
                .items(reservedItems)
                .build();
    }

    private TicketReservationFailedEvent buildFailedEvent(BookingCreatedEvent event, String reason) {
        return TicketReservationFailedEvent.builder()
                .bookingId(event.getBookingId())
                .userId(event.getUserId())
                .reason(reason)
                .failedAt(LocalDateTime.now())
                .build();
    }

    private String buildQrCode(Long bookingId, Long ticketTypeId) {
        return "BOOK-" + bookingId + "-TT-" + ticketTypeId + "-" + UUID.randomUUID();
    }
}
