package fit.iuh.order_service.repositories;

import fit.iuh.order_service.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByIdempotenceKey(String idempotenceKey);
}
