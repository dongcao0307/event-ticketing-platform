package fit.iuh.booking_service.messaging;

import fit.iuh.booking_service.dtos.requests.UpdateBookingStatusRequest;
import fit.iuh.booking_service.entities.Booking;
import fit.iuh.booking_service.entities.BookingStatus;
import fit.iuh.booking_service.repositories.BookingRepository;
import fit.iuh.booking_service.services.BookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "ticket.reservation.messaging", name = "enabled", havingValue = "true")
public class TicketReservationListener {
    private final BookingRepository bookingRepository;
    private final BookingService bookingService;

    @RabbitListener(queues = "${ticket.reservation.messaging.reserved-queue}")
    public void onTicketReserved(TicketReservedEvent event) {
        if (event == null || event.getBookingId() == null) {
            return;
        }

        Booking booking = bookingRepository.findById(event.getBookingId()).orElse(null);
        if (booking == null) {
            log.warn("Received ticket reserved event for missing booking {}", event.getBookingId());
            return;
        }

        if (booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.EXPIRED) {
            log.info("Booking {} already cancelled/expired; ignore reserved event", event.getBookingId());
            return;
        }

        log.info("Ticket reservation confirmed for booking {}", event.getBookingId());
    }

    @RabbitListener(queues = "${ticket.reservation.messaging.failed-queue}")
    public void onTicketReservationFailed(TicketReservationFailedEvent event) {
        if (event == null || event.getBookingId() == null) {
            return;
        }

        Booking booking = bookingRepository.findById(event.getBookingId()).orElse(null);
        if (booking == null) {
            log.warn("Received ticket reservation failed event for missing booking {}", event.getBookingId());
            return;
        }

        if (booking.getStatus() == BookingStatus.CANCELLED || booking.getStatus() == BookingStatus.EXPIRED) {
            log.info("Booking {} already cancelled/expired; ignore reservation failed event", event.getBookingId());
            return;
        }

        try {
            bookingService.updateBookingStatus(
                    event.getBookingId(),
                    UpdateBookingStatusRequest.builder().status(BookingStatus.CANCELLED).build()
            );
            log.info("Booking {} cancelled after reservation failure", event.getBookingId());
        } catch (Exception ex) {
            log.error("Failed to cancel booking {} after reservation failure", event.getBookingId(), ex);
        }
    }
}
