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

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {
    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;
    private final TicketExpiryScheduler ticketExpiryScheduler;

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
        ticketExpiryScheduler.scheduleDefault(saved.getId());
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
        for (Ticket saved : savedTickets) {
            ticketExpiryScheduler.scheduleDefault(saved.getId());
        }

        return true;
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
}
