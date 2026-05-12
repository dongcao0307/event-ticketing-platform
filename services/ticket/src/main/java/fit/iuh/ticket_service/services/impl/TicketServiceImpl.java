package fit.iuh.ticket_service.services.impl;

import fit.iuh.ticket_service.dtos.requests.TicketCreateRequest;
import fit.iuh.ticket_service.dtos.requests.TicketTypeCreateRequest;
import fit.iuh.ticket_service.dtos.requests.TicketUpdateRequest;
import fit.iuh.ticket_service.dtos.responses.TicketResponse;
import fit.iuh.ticket_service.entities.Ticket;
import fit.iuh.ticket_service.entities.TicketStatus;
import fit.iuh.ticket_service.exceptions.AppException;
import fit.iuh.ticket_service.exceptions.ErrorCode;
import fit.iuh.ticket_service.exceptions.PostException;
import fit.iuh.ticket_service.mappers.TicketMapper;
import fit.iuh.ticket_service.redis.TicketExpiryScheduler;
import fit.iuh.ticket_service.repositories.TicketRepository;
import fit.iuh.ticket_service.services.TicketService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.ArrayList;
import org.springframework.data.redis.core.StringRedisTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import fit.iuh.ticket_service.redis.TicketRedisKeys;
import java.util.concurrent.TimeUnit;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class TicketServiceImpl implements TicketService {
    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;
    private final TicketExpiryScheduler ticketExpiryScheduler;
    private final StringRedisTemplate stringRedisTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public Ticket findByIdRaw(Long id) {
        return ticketRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.TICKET_NOT_FOUND));
    }

    @Override
    public TicketResponse findById(Long id) {
        return ticketMapper.toTicketResponse(findByIdRaw(id));
    }

    @Override
    public boolean addTicket(TicketCreateRequest request) {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        factory.close();
        Set<ConstraintViolation<TicketCreateRequest>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            throw new PostException(violations);
        }
        Ticket ticket = ticketMapper.toTicket(request);
        ticket.setTicketStatus(TicketStatus.PENDING);
        Ticket saved = ticketRepository.save(ticket);
        ticketExpiryScheduler.scheduleDefault(saved.getId(), saved.getPerformanceId());
        return true;
    }

    @Override
    public boolean bulkAddTickets(List<TicketCreateRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            return false;
        }

        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        factory.close();

        List<Ticket> ticketsToSave = new ArrayList<>();
        for (TicketCreateRequest request : requests) {
            Set<ConstraintViolation<TicketCreateRequest>> violations = validator.validate(request);
            if (!violations.isEmpty()) {
                throw new PostException(violations);
            }
            Ticket ticket = ticketMapper.toTicket(request);
            ticket.setTicketStatus(TicketStatus.PENDING);
            ticketsToSave.add(ticket);
        }

        List<Ticket> savedTickets = ticketRepository.saveAll(ticketsToSave);
        
        // All tickets should be in the same performance
        Long performanceId = savedTickets.isEmpty() ? null : savedTickets.get(0).getPerformanceId();
        
        for (Ticket saved : savedTickets) {
            ticketExpiryScheduler.scheduleDefault(saved.getId(), saved.getPerformanceId());
        }

        // Update booked seats cache for this performance
        if (performanceId != null) {
            updateBookedSeatsCacheIncremental(performanceId, savedTickets);
        }

        return true;
    }

    private void updateBookedSeatsCacheIncremental(Long performanceId, List<Ticket> newTickets) {
        try {
            String cacheKey = TicketRedisKeys.bookedSeatsKey(performanceId);
            
            // Only update if cache exists
            if (!Boolean.TRUE.equals(stringRedisTemplate.hasKey(cacheKey))) {
                return;
            }
            
            String cached = stringRedisTemplate.opsForValue().get(cacheKey);
            if (cached == null || cached.isEmpty()) {
                return;
            }
            
            List<String> bookedSeats = objectMapper.readValue(cached, new TypeReference<List<String>>(){});
            
            // Add new booked seats
            for (Ticket ticket : newTickets) {
                if (ticket.getSeatNumber() != null && !bookedSeats.contains(ticket.getSeatNumber())) {
                    bookedSeats.add(ticket.getSeatNumber());
                }
            }
            
            // Update cache
            stringRedisTemplate.opsForValue().set(cacheKey, objectMapper.writeValueAsString(bookedSeats), 30, TimeUnit.MINUTES);
        } catch (Exception e) {
            log.error("Failed to update booked seats cache for performanceId {}: {}", performanceId, e.getMessage());
        }
    }

    @Override
    public boolean updateTicket(TicketUpdateRequest request) {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        factory.close();
        Set<ConstraintViolation<TicketUpdateRequest>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            throw new PostException(violations);
        }
        ticketMapper.updateTicket(request, findByIdRaw(request.getId()));
        return true;
    }

    @Override
    public List<String> getBookedSeats(Long performanceId) {
        String key = TicketRedisKeys.bookedSeatsKey(performanceId);
        if (Boolean.TRUE.equals(stringRedisTemplate.hasKey(key))) {
            String cached = stringRedisTemplate.opsForValue().get(key);
            try {
                if (cached != null && !cached.isEmpty()) {
                    return objectMapper.readValue(cached, new TypeReference<List<String>>(){});
                }
            } catch (Exception e) {
                log.error("Failed to parse cached booked seats for performanceId {}", performanceId, e);
            }
            return new ArrayList<>();
        }

        List<String> bookedSeats = ticketRepository.findBookedSeatsByPerformanceId(performanceId);
        try {
            stringRedisTemplate.opsForValue().set(key, objectMapper.writeValueAsString(bookedSeats), 30, TimeUnit.MINUTES);
        } catch (Exception e) {
            log.error("Failed to cache booked seats for performanceId {}", performanceId, e);
        }
        return bookedSeats;
    }
}
