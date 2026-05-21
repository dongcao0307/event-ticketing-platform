package fit.iuh.notification_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Configuration
public class JacksonConfig {
    @Bean
    @Primary // Đánh dấu đây là Bean ưu tiên cao nhất khi Injection
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        // Đăng ký module hỗ trợ LocalDateTime/LocalDate của Java 8
        mapper.registerModule(new JavaTimeModule());
        return mapper;
    }
}
