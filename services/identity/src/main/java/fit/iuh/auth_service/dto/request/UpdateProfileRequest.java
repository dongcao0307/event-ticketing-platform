package fit.iuh.auth_service.dto.request;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String fullName;
    private String phone;
    private String city;
    private String avatarUrl;
}
