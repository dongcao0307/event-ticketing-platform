package fit.iuh.auth_service.repository;

import fit.iuh.auth_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByAccount_UserName(String userName);
}
