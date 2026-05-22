package fit.iuh.auth_service.service;

import fit.iuh.auth_service.dto.request.LoginRequest;
import fit.iuh.auth_service.dto.request.RegisterRequest;
import fit.iuh.auth_service.dto.request.UpdateProfileRequest;
import fit.iuh.auth_service.dto.response.AuthResponse;
import fit.iuh.auth_service.dto.response.UserProfileResponse;
import fit.iuh.auth_service.dto.response.UserResponse;
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
import jakarta.persistence.criteria.Join;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.Instant;
import java.util.Date;
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
    public AuthResponse register(RegisterRequest registerRequest) {
        if (accountRepository.existsByUserName(registerRequest.getUserName())) {
            throw new RuntimeException("Username is already taken!");
        }
        if(accountRepository.existsByEmail(registerRequest.getEmail())){
            throw new RuntimeException("Email is already taken!");
        }

        User user = new User();
        user.setFullName(registerRequest.getFullName());
        user.setPhoneNumber(registerRequest.getPhone());
        user.setCreatedDate(Instant.now());

        Account account = new Account();
        account.setUserName(registerRequest.getUserName());
        account.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        account.setEmail(registerRequest.getEmail());
        account.setRole(Role.USER);
        account.setStatus(AccountStatus.ACTIVE);
        account.setUser(user);
        user.setAccount(account);

        account = accountRepository.save(account);
        String accessToken = jwtService.generateAccessToken(account);
        RefreshToken refreshToken = createRefreshToken(account);
        return buildAuthResponse(account, user, accessToken, refreshToken.getToken());
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        // 1. Xác định identifier (Ưu tiên SĐT, nếu không có thì dùng Email)
        String identifier = request.getPhone() != null && !request.getPhone().isBlank()
                ? request.getPhone()
                : request.getEmail();

        if (identifier == null || identifier.isBlank()) {
            throw new ApiException("Email hoặc số điện thoại không được để trống", HttpStatus.BAD_REQUEST);
        }

        Authentication authentication;
        try {
            // 2. Thực hiện xác thực qua AuthenticationManager
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(identifier, request.getPassword())
            );
        } catch (AuthenticationException e) {
            // 3. Nếu thất bại, tìm kiếm tài khoản để kiểm tra trạng thái khóa (LOCKED)
            Account account = accountRepository.findByEmail(identifier)
                    .or(() -> accountRepository.findById(identifier))
                    .or(() -> accountRepository.findByPhone(identifier))
                    .orElse(null);

            if (account != null && account.getStatus() == AccountStatus.LOCKED) {
                throw new ApiException("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên để biết thêm chi tiết.", HttpStatus.LOCKED);
            }
            
            throw new ApiException("Email, số điện thoại hoặc mật khẩu không chính xác", HttpStatus.UNAUTHORIZED);
        }

        // 4. Lưu thông tin xác thực vào SecurityContextHolder
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 5. Lấy thông tin Account chính xác sau khi đã xác thực thành công
        Account account = accountRepository.findByEmail(identifier)
                .or(() -> accountRepository.findById(identifier))
                .or(() -> accountRepository.findByPhone(identifier))
                .orElseThrow(() -> new ApiException("Tài khoản không tồn tại", HttpStatus.NOT_FOUND));

        // 6. Kiểm tra bổ sung trạng thái BANNED nếu cần (LOCKED đã được xử lý ở catch hoặc có thể check chung ở đây)
        if (account.getStatus() == AccountStatus.BANNED) {
            throw new ApiException("Tài khoản của bạn đã bị cấm (BANNED).", HttpStatus.FORBIDDEN);
        }

        // 7. Tạo Token và build Response bằng Account đã tìm thấy
        String jwt = jwtService.generateAccessToken(account);
        RefreshToken refreshToken = createRefreshToken(account);
        
        // Tìm User theo Email của Account
        User user = userRepository.findByAccount_Email(account.getEmail()).orElse(null);
        
        return buildAuthResponse(account, user, jwt, refreshToken.getToken());
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

        User user = userRepository.findByAccount_UserName(account.getUsername()).orElse(null);

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
        Account account = accountRepository.findByEmail(userName)
                .orElseThrow(() -> new ApiException("Tài khoản không tồn tại", HttpStatus.NOT_FOUND));
        User user = userRepository.findByAccount_Email(userName).orElse(null);
        return toProfileResponse(account, user);
    }

    @Transactional
    public UserProfileResponse updateProfile(String userName, UpdateProfileRequest request) {
        Account account = accountRepository.findByEmail(userName)
                .orElseThrow(() -> new ApiException("Tài khoản không tồn tại", HttpStatus.NOT_FOUND));
        User user = userRepository.findByAccount_Email(userName).orElse(null);

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

    public Page<UserResponse> getAllUsers(int page, int size, String keyword, AccountStatus status) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<Account> spec = Specification.where(null);

        if (keyword != null && !keyword.isEmpty()) {
            spec = spec.and((root, query, cb) -> {
                Join<Account, User> userJoin = root.join("user");
                return cb.or(
                        cb.like(root.get("userName"), "%" + keyword + "%"),
                        cb.like(root.get("email"), "%" + keyword + "%"),
                        cb.like(userJoin.get("fullName"), "%" + keyword + "%")
                );
            });
        }

        if (status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }

        return accountRepository.findAll(spec, pageable).map(this::toUserResponse);
    }

    @Transactional(readOnly = true)
    public UserResponse getUserDetail(String username) {
        Account account = accountRepository.findByUserName(username)
                .orElseThrow(() -> new ApiException("Tài khoản không tồn tại", HttpStatus.NOT_FOUND));
        return toUserResponse(account);
    }

    @Transactional
    public void updateUserStatus(String username, AccountStatus status, String adminUsername) {
        Account account = accountRepository.findByUserName(username)
                .orElseThrow(() -> new ApiException("Tài khoản không tồn tại", HttpStatus.NOT_FOUND));
        if (account.getEmail().equals(adminUsername)) {
            throw new ApiException("Admin không thể tự khóa tài khoản của chính mình", HttpStatus.BAD_REQUEST);
        }
        account.setStatus(status);
        accountRepository.save(account);
    }

    @Transactional
    public void changeAccountStatus(String username, AccountStatus newStatus) {
        Account account = accountRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        account.setStatus(newStatus);
        accountRepository.save(account);
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

    private UserResponse toUserResponse(Account account) {
        User user = account.getUser();
        return new UserResponse(
                account.getUserName(),
                account.getEmail(),
                user != null ? user.getFullName() : null,
                user != null ? user.getPhoneNumber() : null,
                account.getRole(),
                account.getStatus(),
                user != null ? user.getCreatedDate() : null
        );
    }
}
