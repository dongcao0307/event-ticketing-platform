package fit.iuh.ticket_service.messaging;

import fit.iuh.ticket_service.entities.Ticket;
import fit.iuh.ticket_service.entities.TicketStatus;
import fit.iuh.ticket_service.redis.TicketExpiryScheduler;
import fit.iuh.ticket_service.repositories.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import com.fasterxml.jackson.databind.ObjectMapper;
import fit.iuh.ticket_service.redis.TicketRedisKeys;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "booking.lifecycle.messaging", name = "enabled", havingValue = "true")
public class BookingCancelledListener {
    private final TicketRepository ticketRepository;
    private final TicketExpiryScheduler ticketExpiryScheduler;
    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;

    @RabbitListener(queues = "${booking.lifecycle.messaging.cancelled-queue}")
    @Transactional
    public void onBookingCancelled(BookingCancelledEvent event) {
        if (event == null || event.getBookingId() == null) {
            return;
        }

        List<Ticket> tickets = ticketRepository.findByOrderId(event.getBookingId());
        if (tickets == null || tickets.isEmpty()) {
            return;
        }

        int updatedCount = 0;
        for (Ticket ticket : tickets) {
            if (ticket.getTicketStatus() == TicketStatus.PENDING) {
                ticket.setTicketStatus(TicketStatus.CANCELLED);
                ticketExpiryScheduler.cancel(ticket.getId());
                updatedCount++;
            }
        }

        if (updatedCount == 0) {
            return;
        }

        ticketRepository.saveAll(tickets);
        refreshBookedSeatsCache(tickets);
        log.info("Cancelled {} tickets for booking {}", updatedCount, event.getBookingId());
    }

    private void refreshBookedSeatsCache(List<Ticket> tickets) {
        Set<Long> performanceIds = tickets.stream()
                .filter(ticket -> ticket.getPerformanceId() != null)
                .map(Ticket::getPerformanceId)
                .collect(Collectors.toSet());

        for (Long performanceId : performanceIds) {
            String key = TicketRedisKeys.bookedSeatsKey(performanceId);
            if (!Boolean.TRUE.equals(stringRedisTemplate.hasKey(key))) {
                continue;
            }

            List<String> bookedSeats = ticketRepository.findBookedSeatsByPerformanceId(performanceId);
            try {
                stringRedisTemplate.opsForValue().set(key, objectMapper.writeValueAsString(bookedSeats), 30, TimeUnit.MINUTES);
            } catch (Exception ex) {
                log.warn("Failed to refresh booked seats cache for performance {}", performanceId, ex);
            }
        }
    }
}
