package fit.iuh.auth_service.security;

import fit.iuh.auth_service.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return accountRepository.findByEmail(username)
                .orElseGet(() ->
                        accountRepository.findById(username)
                                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy tài khoản: " + username))
                );
    }
}
