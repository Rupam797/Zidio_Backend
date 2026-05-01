package in.zidio.zidioconnect.repository;

import in.zidio.zidioconnect.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    // ✅ Fetch student using linked User ID (still valid if needed elsewhere)
    Student findByUserId(Long userId);

    // ✅ Recommended: Fetch student using User's email (for JWT-based lookup)
    Optional<Student> findByUserEmail(String email);

    // 🔍 Global search: find students by name, skills, or college
    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(COALESCE(s.name, '')) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(COALESCE(s.skills, '')) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(COALESCE(s.college, '')) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Student> searchByQuery(@Param("q") String query);
}
