package fit.iuh.event_service.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

/**
 * JWT Authentication Filter
 * 
 * This filter intercepts every HTTP request and:
 * 1. Extracts the JWT token from the "Authorization: Bearer <token>" header
 * 2. Validates the token signature and expiration
 * 3. If valid, extracts the username/userId and sets it in the SecurityContext
 * 4. If invalid or missing, the SecurityContext remains null, which causes
 *    Spring Security to return 401 Unauthorized for protected endpoints
 * 
 * Flow:
 * - For public endpoints (GET /events): No token required, request passes through
 * - For protected endpoints (POST /organizer/events): Token is required
 *   - If token is missing: Filter doesn't set authentication, Spring Security returns 401
 *   - If token is invalid: Filter doesn't set authentication, Spring Security returns 401
 *   - If token is valid: Authentication is set, request proceeds to controller
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // If Authorization header is missing or doesn't start with "Bearer "
        // Skip token validation and let Spring Security handle it
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.debug("Authorization header missing or invalid for endpoint: {} {}", 
                    request.getMethod(), request.getRequestURI());
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Extract JWT token from "Bearer <token>"
            final String jwt = authHeader.substring(7);
            
            // Validate token (checks signature and expiration)
            if (jwtService.isTokenValid(jwt)) {
                // Extract username from token
                final String username = jwtService.extractUsername(jwt);
                
                log.debug("JWT token validated for user: {} | Endpoint: {} {}", 
                        username, request.getMethod(), request.getRequestURI());
                
                // Create authentication token with username and empty authorities
                UsernamePasswordAuthenticationToken authToken = 
                        new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());
                
                // Set authentication in SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                log.warn("Invalid JWT token (possibly expired) for endpoint: {} {}", 
                        request.getMethod(), request.getRequestURI());
                // Don't set authentication - Spring Security will return 401
            }
        } catch (Exception e) {
            log.warn("JWT validation failed with exception: {} | Endpoint: {} {}", 
                    e.getMessage(), request.getMethod(), request.getRequestURI());
            // Don't set authentication - Spring Security will return 401
        }

        // Continue filter chain
        filterChain.doFilter(request, response);
    }
}
