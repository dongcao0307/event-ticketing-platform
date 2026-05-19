package fit.iuh.event_service.configs;

import net.devh.boot.grpc.server.security.authentication.AnonymousAuthenticationReader;
import net.devh.boot.grpc.server.security.authentication.GrpcAuthenticationReader;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GrpcSecurityConfig {

    @Bean
    public GrpcAuthenticationReader grpcAuthenticationReader() {
        return new AnonymousAuthenticationReader("event-service-anonymous");
    }
}