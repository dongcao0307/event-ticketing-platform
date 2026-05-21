package fit.iuh.auth_service.controller;

import fit.iuh.auth_service.dto.response.ApiResponse;
import fit.iuh.auth_service.dto.response.UserResponse;
import fit.iuh.auth_service.entity.enums.AccountStatus;
import fit.iuh.auth_service.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AuthService authService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<UserResponse>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) AccountStatus status) {
        Page<UserResponse> users = authService.getAllUsers(page, size, keyword, status);
        ApiResponse<Page<UserResponse>> response = ApiResponse.<Page<UserResponse>>builder()
                .success(true)
                .message("Lấy danh sách người dùng thành công")
                .data(users)
                .build();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{username}/status")
    public ResponseEntity<ApiResponse<Void>> updateUserStatus(
            @PathVariable String username,
            @RequestParam AccountStatus status,
            @AuthenticationPrincipal UserDetails userDetails) {
        authService.updateUserStatus(username, status, userDetails.getUsername());
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Cập nhật trạng thái người dùng thành công")
                .build();
        return ResponseEntity.ok(response);
    }
}
