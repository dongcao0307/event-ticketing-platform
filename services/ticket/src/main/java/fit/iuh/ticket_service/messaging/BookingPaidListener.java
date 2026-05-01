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
import java.util.Set;
import java.util.stream.Collectors;
import java.util.concurrent.TimeUnit;
import org.springframework.data.redis.core.StringRedisTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import fit.iuh.ticket_service.redis.TicketRedisKeys;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "booking.messaging", name = "enabled", havingValue = "true")
public class BookingPaidListener {
    private final TicketRepository ticketRepository;
    private final TicketExpiryScheduler ticketExpiryScheduler;
    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;

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

            Set<Long> performanceIds = tickets.stream()
                .filter(t -> t.getTicketStatus() == TicketStatus.PAID)
                .map(Ticket::getPerformanceId)
                .collect(Collectors.toSet());

            for (Long performanceId : performanceIds) {
                String key = TicketRedisKeys.bookedSeatsKey(performanceId);
                if (Boolean.TRUE.equals(stringRedisTemplate.hasKey(key))) {
                    List<String> bookedSeats = ticketRepository.findBookedSeatsByPerformanceId(performanceId);
                    try {
                        stringRedisTemplate.opsForValue().set(key, objectMapper.writeValueAsString(bookedSeats), 30, TimeUnit.MINUTES);
                        log.info("Updated Redis cache for booked seats of performance {}", performanceId);
                    } catch (Exception e) {
                        log.error("Failed to update Redis cache for booked seats of performance {}", performanceId, e);
                    }
                }
            }
        }
    }
}
