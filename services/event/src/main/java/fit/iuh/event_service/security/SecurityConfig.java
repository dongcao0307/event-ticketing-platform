package fit.iuh.event_service.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Tắt CSRF vì mình dùng JWT
                .csrf(csrf -> csrf.disable())
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                // 2. Cấu hình CORS tối ưu (Lấy từ file 1 của Hậu)
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOriginPatterns(List.of("*"));
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                    config.setAllowedHeaders(List.of("*"));
                    config.setAllowCredentials(false);
                    return config;
                }))

                // 3. Phân quyền Endpoint
                .authorizeHttpRequests(auth -> auth
                        // ===== PROTECTED FAVORITES ENDPOINTS (BẮT BUỘC ĐĂNG NHẬP) =====
                        // Đặt lên trên cùng để tránh bị permitAll của rule /events/** nhận diện nhầm
                        .requestMatchers(HttpMethod.POST, "/events/*/favorite/toggle", "/api/events/*/favorite/toggle").authenticated()
                        .requestMatchers(HttpMethod.GET, "/events/favorites", "/api/events/favorites").authenticated()

                        // ===== PUBLIC ENDPOINTS (KHÁCH VÃNG LAI) =====
                        // Bao lô cả /events và /api/events đề phòng Nginx bẻ lái
                        .requestMatchers(HttpMethod.GET, "/events/**", "/api/events/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/cqrs/public/**", "/api/cqrs/public/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/events/reindex", "/events/cqrs/sync-all", "/api/events/cqrs/sync-all", "/cqrs/public/sync-all", "/api/cqrs/public/sync-all").permitAll()

                        // Mở cửa cho Swagger UI và Actuator (Monitor)
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/actuator/**").permitAll()

                        // ===== PROTECTED ENDPOINTS (BẮT BUỘC ĐĂNG NHẬP) =====
                        // Các tác vụ của Organizer, Admin và Upload File
                        .requestMatchers("/organizer/events/**", "/api/organizer/events/**").authenticated()
                        .requestMatchers("/admin/events/**", "/api/admin/events/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/upload/**", "/api/upload/**").authenticated()

                        // Khóa toàn bộ các API còn sót lại
                        .anyRequest().authenticated()
                )

                // 4. Không lưu Session (Stateless)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 5. Chèn bộ lọc JWT vào để kiểm tra Token
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}