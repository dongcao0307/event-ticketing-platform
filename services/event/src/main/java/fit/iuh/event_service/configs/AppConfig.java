package fit.iuh.event_service.configs;

import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.format.DateTimeFormatter;

@Configuration
public class AppConfig {

    // Đây là chuẩn ISO 8601 (có chữ T) - Sang xịn mịn!
    private static final String DATETIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss";

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jsonCustomizer() {
        return builder -> {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DATETIME_FORMAT);

            // Dạy Backend cách đọc (từ Frontend gửi lên)
            builder.deserializers(new LocalDateTimeDeserializer(formatter));

            // Dạy Backend cách viết (trả về cho Frontend)
            builder.serializers(new LocalDateTimeSerializer(formatter));
        };
    }
}