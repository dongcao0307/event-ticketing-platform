package fit.iuh.notification_service.services.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IdentityAccount {
    private Long userId;
    private String email;
    private String userName;
}
