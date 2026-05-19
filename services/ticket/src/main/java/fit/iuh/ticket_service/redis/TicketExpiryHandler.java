package fit.iuh.ticket_service.redis;

import fit.iuh.ticket_service.entities.Ticket;
import fit.iuh.ticket_service.entities.TicketStatus;
import fit.iuh.ticket_service.repositories.TicketRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class TicketExpiryHandler {
    private final TicketRepository ticketRepository;
    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;

    @Transactional
    public void handleExpiredKey(String expiredKey) {
        if (expiredKey == null || !expiredKey.startsWith(TicketRedisKeys.TICKET_EXPIRE_KEY_PREFIX)) {
            return;
        }

        String idPart = expiredKey.substring(TicketRedisKeys.TICKET_EXPIRE_KEY_PREFIX.length());
        Long ticketId;
        try {
            ticketId = Long.parseLong(idPart);
        } catch (NumberFormatException ex) {
            return;
        }

        Ticket ticket = ticketRepository.findById(ticketId).orElse(null);
        if (ticket == null) {
            return;
        }

        if (ticket.getTicketStatus() != TicketStatus.PENDING) {
            return;
        }

        // Get performanceId from redis value
        String valueStr = stringRedisTemplate.opsForValue().get(expiredKey);
        Long performanceId = null;
        if (valueStr != null) {
            try {
                performanceId = Long.parseLong(valueStr);
            } catch (NumberFormatException ex) {
                log.warn("Failed to parse performanceId from redis value: {}", valueStr);
                performanceId = ticket.getPerformanceId();
            }
        } else {
            performanceId = ticket.getPerformanceId();
        }

        // Cancel ticket
        ticket.setTicketStatus(TicketStatus.CANCELLED);
        ticketRepository.save(ticket);

        // Remove seat from booked seats cache if performance exists
        if (performanceId != null && ticket.getSeatNumber() != null) {
            try {
                removeBookedSeatFromCache(performanceId, ticket.getSeatNumber());
            } catch (Exception e) {
                log.error("Failed to remove seat from cache for performanceId {}: {}", performanceId, e.getMessage());
            }
        }
    }

    private void removeBookedSeatFromCache(Long performanceId, String seatNumber) {
        try {
            String cacheKey = TicketRedisKeys.bookedSeatsKey(performanceId);
            Boolean hasKey = stringRedisTemplate.hasKey(cacheKey);
            if (Boolean.TRUE.equals(hasKey)) {
                String cached = stringRedisTemplate.opsForValue().get(cacheKey);
                if (cached != null && !cached.isEmpty()) {
                    java.util.List<String> bookedSeats = objectMapper.readValue(cached, new com.fasterxml.jackson.core.type.TypeReference<java.util.List<String>>(){});
                    bookedSeats.remove(seatNumber);
                    stringRedisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(bookedSeats), 30, java.util.concurrent.TimeUnit.MINUTES);
                    log.info("Removed seat {} from booked seats cache for performanceId {}", seatNumber, performanceId);
                }
            }
        } catch (Exception e) {
            log.error("Failed to remove seat {} from booked seats cache for performanceId {}: {}", seatNumber, performanceId, e.getMessage());
        }
    }
}
