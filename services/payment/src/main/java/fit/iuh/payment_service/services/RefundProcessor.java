package fit.iuh.payment_service.services;

import fit.iuh.payment_service.entities.RefundRequest;
import fit.iuh.payment_service.entities.RefundStatus;
import fit.iuh.payment_service.repositories.RefundRequestRepository;
import fit.iuh.payment_service.repositories.PaymentRepository;
import fit.iuh.payment_service.clients.BookingClient;
import fit.iuh.payment_service.clients.EventClient;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class RefundProcessor {
    private static final Logger log = LoggerFactory.getLogger(RefundProcessor.class);

    private final RefundRequestRepository refundRequestRepository;
    private final PaymentRepository paymentRepository;
    private final BookingClient bookingClient;
    private final EventClient eventClient;

    @Transactional
    public void process(RefundRequest req) {
        log.info("Processing refund request {} for orderId={}", req.getId(), req.getOrderId());

        // Transition to PROCESSING
        req.setStatus(RefundStatus.PROCESSING);
        refundRequestRepository.save(req);

        // 1. Fetch booking details via Booking gRPC
        BookingClient.BookingInfo booking = null;
        try {
            booking = bookingClient.getBooking(req.getOrderId());
        } catch (Exception e) { log.warn("Failed to fetch booking: {}", e.getMessage()); }

        if (booking == null) {
            req.setStatus(RefundStatus.FAILED);
            refundRequestRepository.save(req);
            log.warn("Refund request {} failed: booking not found", req.getId());
            return;
        }

        // 2. Basic business decision based on booking.createdAt
        if (booking.getStatus() == null || !booking.getStatus().equalsIgnoreCase("PAID")) {
            req.setStatus(RefundStatus.FAILED);
            refundRequestRepository.save(req);
            log.info("Refund request {} failed: booking not in PAID status", req.getId());
            return;
        }

        // Check saleEnd conservatively across all ticket types in booking
        if (booking.getTicketTypeIds() != null) {
            for (Long ticketTypeId : booking.getTicketTypeIds()) {
                var ticket = eventClient.getTicketType(ticketTypeId);
                if (ticket != null && ticket.getSaleEnd() != null && LocalDateTime.now().isAfter(ticket.getSaleEnd())) {
                    log.info("TicketType {} saleEnd {} passed: failing refund {}", ticketTypeId, ticket.getSaleEnd(), req.getId());
                    req.setStatus(RefundStatus.FAILED);
                    refundRequestRepository.save(req);
                    return;
                }
            }
        }

        // compute refund percent
        LocalDateTime created = booking.getCreatedAt() != null ? booking.getCreatedAt() : req.getCreatedAt();
        LocalDateTime now = LocalDateTime.now();
        long days = created != null ? java.time.Duration.between(created, now).toDays() : Long.MAX_VALUE;

        java.math.BigDecimal total = booking.getTotalAmount() != null ? booking.getTotalAmount() : java.math.BigDecimal.ZERO;
        java.math.BigDecimal refundAmount = java.math.BigDecimal.ZERO;
        if (days <= 1) refundAmount = total; // 100%
        else if (days <= 2) refundAmount = total.multiply(java.math.BigDecimal.valueOf(0.8));
        else if (days <= 7) refundAmount = total.multiply(java.math.BigDecimal.valueOf(0.5));
        else if (days <= 30) refundAmount = total.multiply(java.math.BigDecimal.valueOf(0.2));
        else refundAmount = java.math.BigDecimal.ZERO;

        req.setAmount(refundAmount);

        // 3. TODO: call provider adapter to perform refund. For now, simulate success if refundAmount > 0
        if (refundAmount.compareTo(java.math.BigDecimal.ZERO) > 0) {
            req.setStatus(RefundStatus.COMPLETED);
            req.setCreatedAt(req.getCreatedAt() == null ? LocalDateTime.now() : req.getCreatedAt());
            refundRequestRepository.save(req);
            log.info("Refund request {} completed (simulated). refundAmount={}", req.getId(), refundAmount);
        } else {
            req.setStatus(RefundStatus.FAILED);
            refundRequestRepository.save(req);
            log.info("Refund request {} failed due to zero refund amount", req.getId());
        }
    }
}
