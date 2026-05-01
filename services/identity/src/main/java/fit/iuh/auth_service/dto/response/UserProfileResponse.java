package fit.iuh.auth_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private String userName;
    private String email;
    private String role;
    private String status;
    private Long userId;
    private String fullName;
    private String phone;
    private String city;
    private String avatarUrl;
}
