package fit.iuh.event_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.ImportAutoConfiguration; // Import thêm cái này
import net.devh.boot.grpc.server.autoconfigure.GrpcServerSecurityAutoConfiguration; // Import thêm cái này
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
@ImportAutoConfiguration(exclude = {GrpcServerSecurityAutoConfiguration.class}) // Thêm dòng này để loại trừ cấu hình bảo mật gRPC đang lỗi
public class EventServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(EventServiceApplication.class, args);
	}
}