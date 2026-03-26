package in.zidio.zidioconnect.repository;

import in.zidio.zidioconnect.model.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    boolean existsByStudentEmailAndJobId(String studentEmail, Long jobId);
    Optional<SavedJob> findByStudentEmailAndJobId(String studentEmail, Long jobId);
    void deleteByStudentEmailAndJobId(String studentEmail, Long jobId);
    List<SavedJob> findByStudentEmailOrderBySavedAtDesc(String studentEmail);
    long countByStudentEmail(String studentEmail);
}
