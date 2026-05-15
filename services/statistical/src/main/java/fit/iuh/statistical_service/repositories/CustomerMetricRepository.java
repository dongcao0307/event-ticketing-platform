package fit.iuh.statistical_service.repositories;

import fit.iuh.statistical_service.models.CustomerMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CustomerMetricRepository extends JpaRepository<CustomerMetric, Long> {
    List<CustomerMetric> findTop10ByOrderByTotalSpentDesc();
    List<CustomerMetric> findTop10ByOrderByTotalOrdersDesc();
}
