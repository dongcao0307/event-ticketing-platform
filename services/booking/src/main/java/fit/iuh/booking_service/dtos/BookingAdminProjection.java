package fit.iuh.booking_service.dtos;

import java.time.LocalDateTime;

public interface BookingAdminProjection {
    Long getId();
    String getCustomerName();    // Phải khớp với alias "as customerName" trong SQL
    String getCustomerEmail();   // Phải khớp với alias "as customerEmail" trong SQL
    String getEventName();       // Phải khớp với alias "as eventName" trong SQL
    String getEventLocation();   // Phải khớp với alias "as eventLocation" trong SQL
    Double getTotalAmount();
    String getStatus();
    LocalDateTime getCreatedAt();
    Integer getTotalTickets();
}