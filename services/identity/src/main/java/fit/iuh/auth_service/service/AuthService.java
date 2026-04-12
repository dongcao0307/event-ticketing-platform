package fit.iuh.auth_service.service;

import fit.iuh.auth_service.dto.request.LoginRequest;
import fit.iuh.auth_service.dto.request.RegisterRequest;
import fit.iuh.auth_service.dto.request.UpdateProfileRequest;
import fit.iuh.auth_service.dto.response.AuthResponse;
import fit.iuh.auth_service.dto.response.UserProfileResponse;
import fit.iuh.auth_service.entity.Account;
import fit.iuh.auth_service.entity.RefreshToken;
import fit.iuh.auth_service.entity.User;
import fit.iuh.auth_service.entity.enums.AccountStatus;
import fit.iuh.auth_service.entity.enums.Role;
import fit.iuh.auth_service.exception.ApiException;
import fit.iuh.auth_service.repository.AccountRepository;
import fit.iuh.auth_service.repository.RefreshTokenRepository;
import fit.iuh.auth_service.repository.UserRepository;
import fit.iuh.auth_service.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (accountRepository.existsByEmail(request.getEmail())) {
            throw new ApiException("Email đã được sử dụng", HttpStatus.CONFLICT);
        }
        if (accountRepository.existsByUserName(request.getUserName())) {
            throw new ApiException("Tên đăng nhập đã tồn tại", HttpStatus.CONFLICT);
        }

        Account account = Account.builder()
                .userName(request.getUserName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .status(AccountStatus.ACTIVE)
                .role(Role.USER)
                .build();
        accountRepository.save(account);

        User user = User.builder()
                .fullName(request.getFullName() != null ? request.getFullName() : request.getUserName())
                .phoneNumber(request.getPhone())
                .account(account)
                .build();
        userRepository.save(user);

        String accessToken = jwtService.generateAccessToken(account);
        RefreshToken refreshToken = createRefreshToken(account);

        return buildAuthResponse(account, user, accessToken, refreshToken.getToken());
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        Account account = accountRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ApiException("Tài khoản không tồn tại", HttpStatus.NOT_FOUND));

        refreshTokenRepository.revokeAllByAccountUserName(account.getUserName());

        String accessToken = jwtService.generateAccessToken(account);
        RefreshToken refreshToken = createRefreshToken(account);

        User user = userRepository.findByAccount_UserName(account.getUserName()).orElse(null);

        return buildAuthResponse(account, user, accessToken, refreshToken.getToken());
    }

    @Transactional
    public AuthResponse refreshToken(String refreshTokenStr) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenStr)
                .orElseThrow(() -> new ApiException("Refresh token không hợp lệ", HttpStatus.UNAUTHORIZED));

        if (refreshToken.isRevoked()) {
            throw new ApiException("Refresh token đã bị thu hồi", HttpStatus.UNAUTHORIZED);
        }

        if (refreshToken.getExpiresAt().isBefore(Instant.now())) {
            throw new ApiException("Refresh token đã hết hạn", HttpStatus.UNAUTHORIZED);
        }

        Account account = refreshToken.getAccount();
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);

        String newAccessToken = jwtService.generateAccessToken(account);
        RefreshToken newRefreshToken = createRefreshToken(account);

        User user = userRepository.findByAccount_UserName(account.getUserName()).orElse(null);

        return buildAuthResponse(account, user, newAccessToken, newRefreshToken.getToken());
    }

    @Transactional
    public void logout(String refreshTokenStr) {
        refreshTokenRepository.findByToken(refreshTokenStr)
                .ifPresent(rt -> {
                    rt.setRevoked(true);
                    refreshTokenRepository.save(rt);
                });
    }

    public UserProfileResponse getProfile(String userName) {
        Account account = accountRepository.findById(userName)
                .orElseThrow(() -> new ApiException("Tài khoản không tồn tại", HttpStatus.NOT_FOUND));
        User user = userRepository.findByAccount_UserName(userName).orElse(null);
        return toProfileResponse(account, user);
    }

    @Transactional
    public UserProfileResponse updateProfile(String userName, UpdateProfileRequest request) {
        Account account = accountRepository.findById(userName)
                .orElseThrow(() -> new ApiException("Tài khoản không tồn tại", HttpStatus.NOT_FOUND));
        User user = userRepository.findByAccount_UserName(userName).orElse(null);

        if (user == null) {
            user = User.builder().account(account).build();
        }

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhone() != null) {
            user.setPhoneNumber(request.getPhone());
            account.setPhone(request.getPhone());
        }
        if (request.getCity() != null) user.setCity(request.getCity());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());

        accountRepository.save(account);
        userRepository.save(user);

        return toProfileResponse(account, user);
    }

    private RefreshToken createRefreshToken(Account account) {
        RefreshToken refreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .account(account)
                .expiresAt(Instant.now().plusMillis(refreshTokenExpiration))
                .revoked(false)
                .build();
        return refreshTokenRepository.save(refreshToken);
    }

    private AuthResponse buildAuthResponse(Account account, User user, String accessToken, String refreshToken) {
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(900)
                .user(toProfileResponse(account, user))
                .build();
    }

    private UserProfileResponse toProfileResponse(Account account, User user) {
        return UserProfileResponse.builder()
                .userName(account.getUserName())
                .email(account.getEmail())
                .role(account.getRole().name())
                .status(account.getStatus().name())
                .userId(user != null ? user.getId() : null)
                .fullName(user != null ? user.getFullName() : null)
                .phone(account.getPhone())
                .city(user != null ? user.getCity() : null)
                .avatarUrl(user != null ? user.getAvatarUrl() : null)
                .build();
    }
}
