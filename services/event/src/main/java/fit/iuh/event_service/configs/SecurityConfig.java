package fit.iuh.event_service.configs;

import fit.iuh.event_service.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

/**
 * Spring Security Configuration for Event Service
 * 
 * Authorization Rules:
 * 1. PUBLIC ENDPOINTS (No authentication required):
 *    - GET /events/** (all event viewing endpoints)
 *    - Swagger UI: /swagger-ui/**, /v3/api-docs/**
 *    - Actuator: /actuator/**
 * 
 * 2. PROTECTED ENDPOINTS (JWT token required):
 *    - POST /organizer/events (create event)
 *    - PUT /organizer/events/{eventId} (update event)
 *    - DELETE /organizer/events/{eventId} (delete event)
 *    - POST /admin/events/** (admin operations)
 *    - All other POST, PUT, DELETE requests
 * 
 * How Authentication Works:
 * - JwtAuthenticationFilter intercepts all requests and validates the JWT token
 * - If token is missing or invalid, SecurityContext has no Authentication
 * - For protected endpoints: Spring Security checks SecurityContext
 *   - If no authentication present → returns 401 Unauthorized
 *   - If authentication present → request proceeds to controller
 * - For public endpoints: No authentication check needed
 * 
 * Session Policy: STATELESS
 * - No session cookies are used
 * - Each request must include JWT token in Authorization header
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * Configure HTTP Security
     * 
     * Key configuration:
     * - CSRF disabled: Not needed for stateless JWT-based authentication
     * - CORS enabled: Allows requests from different origins
     * - Stateless sessions: Each request is independent
     * - Public endpoints: GET /events/** permitted without authentication
     * - Protected endpoints: All other requests require authentication
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF - not needed for stateless JWT authentication
                .csrf(csrf -> csrf.disable())
                
                // Enable CORS with permissive configuration
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    config.setAllowedOriginPatterns(List.of("*"));
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
                    config.setAllowedHeaders(List.of("*"));
                    config.setAllowCredentials(false);
                    return config;
                }))
                
                // Authorization configuration
                .authorizeHttpRequests(auth -> auth
                        // ===== PUBLIC ENDPOINTS (No Authentication Required) =====
                        
                        // Allow GET requests to /events/** (view events, search, etc.)
                        .requestMatchers(HttpMethod.GET, "/events/**").permitAll()
                        
                        // Swagger and API documentation
                        .requestMatchers(
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/v3/api-docs"
                        ).permitAll()
                        
                        // Actuator endpoints for monitoring
                        .requestMatchers("/actuator/**").permitAll()
                        
                        // ===== PROTECTED ENDPOINTS (Authentication Required) =====
                        
                        // All POST, PUT, DELETE requests to /organizer/events require authentication
                        .requestMatchers(HttpMethod.POST, "/organizer/events/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/organizer/events/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/organizer/events/**").authenticated()
                        
                        // All POST, PUT, DELETE requests to /admin/events require authentication
                        .requestMatchers(HttpMethod.POST, "/admin/events/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/admin/events/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/admin/events/**").authenticated()
                        
                        // File upload endpoints require authentication
                        .requestMatchers(HttpMethod.POST, "/upload/**").authenticated()
                        
                        // All other requests require authentication
                        .anyRequest().authenticated()
                )
                
                // Session management: Stateless (no session cookies)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                
                // Add JWT filter before UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Optional: If needed, configure AuthenticationManager
     * This is useful if you want to support username/password authentication
     */
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .build();
    }
}
