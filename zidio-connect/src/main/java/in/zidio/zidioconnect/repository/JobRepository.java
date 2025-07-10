package in.zidio.zidioconnect.repository;

import in.zidio.zidioconnect.model.Job;
import in.zidio.zidioconnect.model.Recruiter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByIsActiveTrue();
    List<Job> findByRecruiter(Recruiter recruiter);
}
