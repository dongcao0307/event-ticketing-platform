package fit.iuh.auth_service.dto.response;

import fit.iuh.auth_service.entity.enums.AccountStatus;
import fit.iuh.auth_service.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String userName;
    private String email;
    private String fullName;
    private String phone;
    private Role role;
    private AccountStatus status;
    private Instant createdDate;
}
