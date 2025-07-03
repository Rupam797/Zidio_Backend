package in.zidio.zidioconnect.repository;

import in.zidio.zidioconnect.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);  // for login
    boolean existsByEmail(String email);       // for registration validation
}
