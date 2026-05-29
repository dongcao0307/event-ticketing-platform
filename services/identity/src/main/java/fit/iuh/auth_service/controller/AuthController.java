package fit.iuh.auth_service.controller;

import fit.iuh.auth_service.dto.request.LoginRequest;
import fit.iuh.auth_service.dto.request.RefreshTokenRequest;
import fit.iuh.auth_service.dto.request.RegisterRequest;
import fit.iuh.auth_service.dto.request.UpdateProfileRequest;
import fit.iuh.auth_service.dto.response.ApiResponse;
import fit.iuh.auth_service.dto.response.AuthResponse;
import fit.iuh.auth_service.dto.response.UserProfileResponse;
import fit.iuh.auth_service.service.AuthService;
import fit.iuh.auth_service.exception.ApiException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse servletResponse) {
        AuthResponse response = authService.register(request);
        
        setTokenCookies(servletResponse, response.getAccessToken(), response.getRefreshToken());
        
        // Remove tokens from response body for security
        response.setAccessToken(null);
        response.setRefreshToken(null);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Đăng ký thành công", response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse servletResponse) {
        AuthResponse response = authService.login(request);
        
        setTokenCookies(servletResponse, response.getAccessToken(), response.getRefreshToken());
        
        // Remove tokens from response body for security
        response.setAccessToken(null);
        response.setRefreshToken(null);
        
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", response));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @RequestBody(required = false) RefreshTokenRequest request,
            HttpServletRequest servletRequest,
            HttpServletResponse servletResponse) {
        
        String refreshToken = null;
        if (request != null && request.getRefreshToken() != null && !request.getRefreshToken().isBlank()) {
            refreshToken = request.getRefreshToken();
        } else if (servletRequest.getCookies() != null) {
            for (var cookie : servletRequest.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken == null || refreshToken.isBlank()) {
            throw new ApiException("Refresh token không hợp lệ", HttpStatus.UNAUTHORIZED);
        }

        AuthResponse response = authService.refreshToken(refreshToken);
        
        setTokenCookies(servletResponse, response.getAccessToken(), response.getRefreshToken());
        
        // Remove tokens from response body for security
        response.setAccessToken(null);
        response.setRefreshToken(null);
        
        return ResponseEntity.ok(ApiResponse.success("Làm mới token thành công", response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @RequestBody(required = false) RefreshTokenRequest request,
            HttpServletRequest servletRequest,
            HttpServletResponse servletResponse) {
        
        String refreshToken = null;
        if (request != null && request.getRefreshToken() != null && !request.getRefreshToken().isBlank()) {
            refreshToken = request.getRefreshToken();
        } else if (servletRequest.getCookies() != null) {
            for (var cookie : servletRequest.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken != null) {
            authService.logout(refreshToken);
        }
        
        clearTokenCookies(servletResponse);
        
        return ResponseEntity.ok(ApiResponse.success("Đăng xuất thành công", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        UserProfileResponse profile = authService.getProfile(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Lấy thông tin thành công", profile));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateProfileRequest request) {
        UserProfileResponse profile = authService.updateProfile(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật thành công", profile));
    }

    private void setTokenCookies(HttpServletResponse response, String accessToken, String refreshToken) {
        // Access token cookie (short lifespan)
        org.springframework.http.ResponseCookie accessTokenCookie = org.springframework.http.ResponseCookie.from("accessToken", accessToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(900) // 15 mins
                .sameSite("Lax") // Set to Lax to support local testing across ports (3000/5000 to 8443)
                .build();

        // Refresh token cookie (longer lifespan)
        org.springframework.http.ResponseCookie refreshTokenCookie = org.springframework.http.ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(604800) // 7 days
                .sameSite("Lax")
                .build();

        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
    }

    private void clearTokenCookies(HttpServletResponse response) {
        org.springframework.http.ResponseCookie accessTokenCookie = org.springframework.http.ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        org.springframework.http.ResponseCookie refreshTokenCookie = org.springframework.http.ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
        response.addHeader(org.springframework.http.HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
    }
}
