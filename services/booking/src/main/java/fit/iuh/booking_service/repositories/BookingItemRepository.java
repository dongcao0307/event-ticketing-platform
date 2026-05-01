package fit.iuh.booking_service.repositories;

import fit.iuh.booking_service.entities.BookingItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingItemRepository extends JpaRepository<BookingItem, Long> {
}
