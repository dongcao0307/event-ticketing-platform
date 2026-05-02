package fit.iuh.ticket_service.redis;

import fit.iuh.ticket_service.entities.Ticket;
import fit.iuh.ticket_service.entities.TicketStatus;
import fit.iuh.ticket_service.repositories.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TicketExpiryHandler {
    private final TicketRepository ticketRepository;

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

        ticket.setTicketStatus(TicketStatus.CANCELLED);
        ticketRepository.save(ticket);
    }
}
