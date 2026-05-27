package fit.iuh.auth_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String phone;
    private String turnstileToken;

    @NotBlank(message = "Mật khẩu không được để trống")
    private String password;
}
