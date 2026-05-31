package fit.iuh.event_service.configs;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.scheduling.annotation.EnableAsync;

@Configuration
@EnableAsync
@EnableMongoRepositories(basePackages = "fit.iuh.event_service.repositories.mongo")
@EnableJpaRepositories(
    basePackages = "fit.iuh.event_service.repositories",
    excludeFilters = @ComponentScan.Filter(type = FilterType.REGEX, pattern = "fit\\.iuh\\.event_service\\.repositories\\.mongo\\..*")
)
public class MongoConfig {
}
