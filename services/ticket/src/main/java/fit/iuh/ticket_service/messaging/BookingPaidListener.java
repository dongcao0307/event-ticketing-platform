package fit.iuh.ticket_service.messaging;

import fit.iuh.ticket_service.entities.Ticket;
import fit.iuh.ticket_service.entities.TicketStatus;
import fit.iuh.ticket_service.redis.TicketExpiryScheduler;
import fit.iuh.ticket_service.repositories.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "booking.messaging", name = "enabled", havingValue = "true")
public class BookingPaidListener {
    private final TicketRepository ticketRepository;
    private final TicketExpiryScheduler ticketExpiryScheduler;

    @RabbitListener(queues = "${booking.messaging.queue}")
    @Transactional
    public void onBookingPaid(BookingPaidEvent event) {
        if (event == null || event.getBookingId() == null || event.getUserId() == null) {
            return;
        }

        List<Ticket> tickets = ticketRepository.findByOrderId(event.getBookingId());
        if (tickets == null || tickets.isEmpty()) {
            log.warn("Received paid event for booking {}, but no tickets found", event.getBookingId());
            return;
        }

        int updatedCount = 0;
        for (Ticket ticket : tickets) {
            if (ticket.getTicketStatus() == TicketStatus.PENDING) {
                ticket.setTicketStatus(TicketStatus.PAID);
                ticketExpiryScheduler.cancel(ticket.getId());
                updatedCount++;
            }
        }

        if (updatedCount > 0) {
            ticketRepository.saveAll(tickets);
            log.info("Updated {} tickets to PAID for booking {}", updatedCount, event.getBookingId());
        }
    }
}
