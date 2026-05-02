package fit.iuh.booking_service.services.impl;

import fit.iuh.booking_service.dtos.requests.AddBookingItemRequest;
import fit.iuh.booking_service.dtos.requests.CreateBookingRequest;
import fit.iuh.booking_service.dtos.requests.UpdateBookingStatusRequest;
import fit.iuh.booking_service.dtos.responses.BookingResponse;
import fit.iuh.booking_service.entities.Booking;
import fit.iuh.booking_service.entities.BookingItem;
import fit.iuh.booking_service.entities.BookingStatus;
import fit.iuh.booking_service.exceptions.AppException;
import fit.iuh.booking_service.exceptions.ErrorCode;
import fit.iuh.booking_service.exceptions.PostException;
import fit.iuh.booking_service.messaging.BookingEventPublisher;
import fit.iuh.booking_service.messaging.BookingPaidEvent;
import fit.iuh.booking_service.mappers.BookingMapper;
import fit.iuh.booking_service.redis.BookingExpiryScheduler;
import fit.iuh.booking_service.repositories.BookingRepository;
import fit.iuh.booking_service.services.BookingService;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;
    private final BookingExpiryScheduler bookingExpiryScheduler;
    private final BookingEventPublisher bookingEventPublisher;

    @Value("${booking.expire.minutes:17}")
    private long expireMinutes;

    @Override
    @Transactional
    public BookingResponse createBooking(CreateBookingRequest request) {
        validateRequest(request);

        Booking existed = bookingRepository.findByIdempotenceKey(request.getIdempotenceKey()).orElse(null);
        if (existed != null) {
            ensureExpiryKey(existed);
            return bookingMapper.toBookingResponse(existed);
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiredAt = now.plusMinutes(expireMinutes);

        BigDecimal discount = request.getDiscountAmount() == null ? BigDecimal.ZERO : request.getDiscountAmount();
        if (discount.compareTo(BigDecimal.ZERO) < 0) {
            throw new AppException(ErrorCode.INVALID_POST_REQUEST);
        }

        Booking booking = Booking.builder()
                .userId(request.getUserId())
                .idempotenceKey(request.getIdempotenceKey())
                .subtotal(BigDecimal.ZERO)
                .discountAmount(discount)
                .totalAmount(BigDecimal.ZERO)
                .status(BookingStatus.PENDING)
                .createdAt(now)
                .expiredAt(expiredAt)
                .version(1L)
                .build();

        Booking saved = bookingRepository.save(booking);
        bookingExpiryScheduler.schedule(saved.getId(), Duration.ofMinutes(expireMinutes));

        return bookingMapper.toBookingResponse(saved);
    }

    @Override
    @Transactional
    public BookingResponse addBookingItems(Long bookingId, List<AddBookingItemRequest> requests) {
        validateBatchRequest(requests);

        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new AppException(ErrorCode.BOOKING_NOT_PENDING);
        }

        for (AddBookingItemRequest request : requests) {
            if (request.getUnitPrice() != null && request.getUnitPrice().compareTo(BigDecimal.ZERO) < 0) {
                throw new AppException(ErrorCode.INVALID_POST_REQUEST);
            }

            BookingItem item = BookingItem.builder()
                    .booking(booking)
                    .ticketTypeId(request.getTicketTypeId())
                    .quantity(request.getQuantity())
                    .unitPrice(request.getUnitPrice())
                    .build();

            booking.getItems().add(item);
        }

        recomputeTotals(booking);
        booking.setVersion(booking.getVersion() == null ? 1L : booking.getVersion() + 1);

        Booking saved = bookingRepository.save(booking);
        ensureExpiryKey(saved);
        return bookingMapper.toBookingResponse(saved);
    }

    @Override
    @Transactional
    public BookingResponse updateBookingStatus(Long bookingId, UpdateBookingStatusRequest request) {
        validateRequest(request);

        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        BookingStatus oldStatus = booking.getStatus();
        BookingStatus newStatus = request.getStatus();

        if (oldStatus == newStatus) {
            if (newStatus == BookingStatus.PAID || newStatus == BookingStatus.CANCELLED) {
                bookingExpiryScheduler.cancel(bookingId);
            }
            return bookingMapper.toBookingResponse(booking);
        }

        booking.setStatus(newStatus);
        booking.setVersion(booking.getVersion() == null ? 1L : booking.getVersion() + 1);
        Booking saved = bookingRepository.save(booking);

        if (newStatus == BookingStatus.PAID || newStatus == BookingStatus.CANCELLED) {
            bookingExpiryScheduler.cancel(bookingId);
        }

        if (newStatus == BookingStatus.PAID) {
            bookingEventPublisher.publishBookingPaid(toBookingPaidEvent(saved));
        }

        return bookingMapper.toBookingResponse(saved);
    }

    @Override
    public BookingResponse findById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        return bookingMapper.toBookingResponse(booking);
    }

    private void recomputeTotals(Booking booking) {
        BigDecimal subtotal = BigDecimal.ZERO;
        for (BookingItem item : booking.getItems()) {
            if (item.getUnitPrice() == null || item.getQuantity() == null) {
                continue;
            }
            subtotal = subtotal.add(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }
        booking.setSubtotal(subtotal);

        BigDecimal discount = booking.getDiscountAmount() == null ? BigDecimal.ZERO : booking.getDiscountAmount();
        if (discount.compareTo(BigDecimal.ZERO) < 0) {
            discount = BigDecimal.ZERO;
        }
        booking.setDiscountAmount(discount);

        BigDecimal total = subtotal.subtract(discount);
        if (total.compareTo(BigDecimal.ZERO) < 0) {
            total = BigDecimal.ZERO;
        }
        booking.setTotalAmount(total);
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

    private void ensureExpiryKey(Booking booking) {
        if (booking == null || booking.getId() == null) {
            return;
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            return;
        }

        LocalDateTime expiredAt = booking.getExpiredAt();
        if (expiredAt == null) {
            bookingExpiryScheduler.scheduleDefault(booking.getId());
            return;
        }

        Duration ttl = Duration.between(LocalDateTime.now(), expiredAt);
        bookingExpiryScheduler.schedule(booking.getId(), ttl);
    }

    private BookingPaidEvent toBookingPaidEvent(Booking booking) {
        List<BookingPaidEvent.BookingPaidItem> paidItems = booking.getItems().stream()
                .map(item -> BookingPaidEvent.BookingPaidItem.builder()
                        .ticketTypeId(item.getTicketTypeId())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .build())
                .toList();

        return BookingPaidEvent.builder()
                .bookingId(booking.getId())
                .userId(booking.getUserId())
                .paidAt(LocalDateTime.now())
                .items(paidItems)
                .build();
    }
}
