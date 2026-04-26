package fit.iuh.ticket_service.messaging;

import fit.iuh.ticket_service.dtos.requests.TicketCreateRequest;
import fit.iuh.ticket_service.entities.TicketType;
import fit.iuh.ticket_service.repositories.TicketRepository;
import fit.iuh.ticket_service.services.TicketService;
import fit.iuh.ticket_service.services.TicketTypeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "booking.messaging", name = "enabled", havingValue = "true")
public class BookingPaidListener {
    private final TicketService ticketService;
    private final TicketTypeService ticketTypeService;
    private final TicketRepository ticketRepository;

    @RabbitListener(queues = "${booking.messaging.queue}")
    @Transactional
    public void onBookingPaid(BookingPaidEvent event) {
        if (event == null || event.getBookingId() == null || event.getUserId() == null) {
            return;
        }

        List<BookingPaidEvent.BookingPaidItem> items = event.getItems();
        if (items == null || items.isEmpty()) {
            return;
        }

        long expectedTicketCount = items.stream()
                .filter(item -> item != null && item.getQuantity() != null && item.getQuantity() > 0)
                .mapToLong(BookingPaidEvent.BookingPaidItem::getQuantity)
                .sum();

        if (expectedTicketCount <= 0) {
            return;
        }

        long existingForBooking = ticketRepository.countByOrderId(event.getBookingId());
        if (existingForBooking >= expectedTicketCount) {
            log.info("Booking {} already has {} tickets, skip creation", event.getBookingId(), existingForBooking);
            return;
        }

        for (BookingPaidEvent.BookingPaidItem item : items) {
            if (item == null || item.getTicketTypeId() == null || item.getQuantity() == null || item.getQuantity() <= 0) {
                continue;
            }

            TicketType ticketType = ticketTypeService.findByIdRaw(item.getTicketTypeId());
            long existingForType = ticketRepository.countByOrderIdAndTicketType_Id(event.getBookingId(), item.getTicketTypeId());
            int toCreate = (int) Math.max(0, item.getQuantity() - existingForType);

            for (int i = 0; i < toCreate; i++) {
                TicketCreateRequest request = new TicketCreateRequest();
                request.setTicketTypeId(item.getTicketTypeId());
                request.setPerformanceId(ticketType.getPerformanceId());
                request.setUserId(event.getUserId());
                request.setOrderId(event.getBookingId());
                request.setQrCode(buildQrCode(event.getBookingId(), item.getTicketTypeId()));
                request.setPriceAtPurchase(item.getUnitPrice() == null ? BigDecimal.ZERO : item.getUnitPrice());

                ticketService.addTicket(request);
            }
        }

        log.info("Generated tickets for booking {} from booking.paid event", event.getBookingId());
    }

    private String buildQrCode(Long bookingId, Long ticketTypeId) {
        return "ORD-" + bookingId + "-TT-" + ticketTypeId + "-" + UUID.randomUUID();
    }
}
