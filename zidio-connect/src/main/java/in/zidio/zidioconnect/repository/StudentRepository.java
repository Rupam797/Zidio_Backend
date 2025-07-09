package in.zidio.zidioconnect.repository;

import in.zidio.zidioconnect.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    // ✅ Fetch student using linked User ID (still valid if needed elsewhere)
    Student findByUserId(Long userId);

    // ✅ Recommended: Fetch student using User's email (for JWT-based lookup)
    Optional<Student> findByUserEmail(String email);
}
