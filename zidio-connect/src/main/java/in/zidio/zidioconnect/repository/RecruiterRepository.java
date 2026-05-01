package in.zidio.zidioconnect.repository;

import in.zidio.zidioconnect.model.Recruiter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RecruiterRepository extends JpaRepository<Recruiter, Long> {
    Recruiter findByUserId(Long userId);
    Recruiter findByUserEmail(String email);

    // 🔍 Global search: find recruiters by username or company name
    @Query("SELECT r FROM Recruiter r WHERE " +
           "LOWER(COALESCE(r.user.username, '')) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(COALESCE(r.companyName, '')) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Recruiter> searchByQuery(@Param("q") String query);
}
