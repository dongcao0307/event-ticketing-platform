package fit.iuh.auth_service.repository;

import fit.iuh.auth_service.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, String> {
    Optional<Account> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByUserName(String userName);
}
