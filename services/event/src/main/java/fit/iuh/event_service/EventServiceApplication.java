package fit.iuh.event_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import net.devh.boot.grpc.server.autoconfigure.GrpcServerSecurityAutoConfiguration;

@SpringBootApplication(exclude = GrpcServerSecurityAutoConfiguration.class)
public class EventServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(EventServiceApplication.class, args);
	}

}
