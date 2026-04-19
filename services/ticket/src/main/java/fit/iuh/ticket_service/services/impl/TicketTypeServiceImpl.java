package fit.iuh.ticket_service.services.impl;

import fit.iuh.ticket_service.dtos.requests.TicketTypeCreateRequest;
import fit.iuh.ticket_service.dtos.requests.TicketTypeBulkWriteRequest;
import fit.iuh.ticket_service.dtos.requests.TicketTypeUpdateRequest;
import fit.iuh.ticket_service.dtos.responses.TicketTypeResponse;
import fit.iuh.ticket_service.entities.TicketType;
import fit.iuh.ticket_service.exceptions.AppException;
import fit.iuh.ticket_service.exceptions.ErrorCode;
import fit.iuh.ticket_service.exceptions.PostException;
import fit.iuh.ticket_service.mappers.TicketTypeMapper;
import fit.iuh.ticket_service.repositories.TicketTypeRepository;
import fit.iuh.ticket_service.services.TicketTypeService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketTypeServiceImpl implements TicketTypeService {
    private final TicketTypeRepository ticketTypeRepository;
    private final TicketTypeMapper ticketTypeMapper;

    @Override
    public boolean addTicketType(TicketTypeCreateRequest request) {
        validateRequest(request);
        ticketTypeRepository.save(ticketTypeMapper.toTicketType(request));
        return true;
    }

    @Override
    @Transactional
    public boolean addTicketTypes(List<TicketTypeCreateRequest> requests) {
        validateBatchRequest(requests);
        List<TicketType> ticketTypes = requests.stream()
                .map(ticketTypeMapper::toTicketType)
                .toList();
        ticketTypeRepository.saveAll(ticketTypes);
        return true;
    }

    @Override
    public boolean updateTicketType(TicketTypeUpdateRequest request) {
        validateRequest(request);

        TicketType fromDB = findByIdRaw(request.getId());
        ticketTypeMapper.updateTicketType(request, fromDB);
        ticketTypeRepository.save(fromDB);
        return true;
    }

    @Override
    @Transactional
    public boolean updateTicketTypes(List<TicketTypeUpdateRequest> requests) {
        validateBatchRequest(requests);
        for (TicketTypeUpdateRequest request : requests) {
            TicketType fromDB = findByIdRaw(request.getId());
            ticketTypeMapper.updateTicketType(request, fromDB);
        }
        return true;
    }

    @Override
    @Transactional
    public List<TicketTypeResponse> upsertTicketTypes(List<TicketTypeBulkWriteRequest> requests) {
        validateBatchRequest(requests);
        List<TicketType> ticketTypes = requests.stream()
                .map(this::mapBulkWriteRequest)
                .toList();
        return ticketTypeRepository.saveAll(ticketTypes).stream().map(ticketTypeMapper::toTicketTypeResponse).toList();
    }

    @Override
    public TicketTypeResponse findById(Long id) {
        return ticketTypeMapper.toTicketTypeResponse(findByIdRaw(id));
    }

    @Override
    public TicketType findByIdRaw(Long id) {
        return ticketTypeRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.TICKET_TYPE_NOT_FOUND));
    }

    @Override
    public List<TicketTypeResponse> findAll() {
        return ticketTypeRepository.findAll().stream().map(ticketTypeMapper::toTicketTypeResponse).toList();
    }

    private <T> void validateRequest(T request) {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        factory.close();
        Set<ConstraintViolation<T>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            throw new PostException(violations);
        }
    }

    private <T> void validateBatchRequest(List<T> requests) {
        if (requests == null || requests.isEmpty()) {
            throw new PostException(Collections.emptySet(), Map.of("requests", "requests must not be empty"));
        }

        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        factory.close();

        Map<String, String> errors = new LinkedHashMap<>();
        for (int i = 0; i < requests.size(); i++) {
            T request = requests.get(i);
            if (request == null) {
                errors.put("requests[" + i + "]", "request must not be null");
                continue;
            }
            Set<ConstraintViolation<T>> violations = validator.validate(request);
            for (ConstraintViolation<T> violation : violations) {
                errors.put("requests[" + i + "]." + violation.getPropertyPath(), violation.getMessage());
            }
        }

        if (!errors.isEmpty()) {
            throw new PostException(Collections.emptySet(), errors);
        }
    }

    private TicketType mapBulkWriteRequest(TicketTypeBulkWriteRequest request) {
        TicketType ticketType = request.getId() == null
                ? new TicketType()
                : findByIdRaw(request.getId());

        if (request.getId() == null) {
            ticketType.setPerformanceId(request.getPerformanceId());
            ticketType.setSoldQuantity(request.getSoldQuantity() == null ? 0 : request.getSoldQuantity());
            ticketType.setReservedQuantity(request.getReservedQuantity() == null ? 0 : request.getReservedQuantity());
        }

        ticketType.setName(request.getName());
        ticketType.setPrice(request.getPrice());
        ticketType.setTotalQuantity(request.getTotalQuantity());
        ticketType.setMaxTicketsPerUser(request.getMaxTicketsPerUser());
        ticketType.setVersion(request.getVersion());

        if (request.getId() != null) {
            ticketType.setSoldQuantity(request.getSoldQuantity());
            ticketType.setReservedQuantity(request.getReservedQuantity());
        }

        return ticketType;
    }
}
