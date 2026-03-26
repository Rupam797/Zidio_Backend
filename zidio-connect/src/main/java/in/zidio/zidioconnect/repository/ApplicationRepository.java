package in.zidio.zidioconnect.repository;

import in.zidio.zidioconnect.model.Application;
import in.zidio.zidioconnect.model.Job;
import in.zidio.zidioconnect.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudent(Student student);
    List<Application> findByStudentOrderByAppliedAtDesc(Student student);
    List<Application> findByJob(Job job);
    boolean existsByStudentAndJob(Student student, Job job);
    Optional<Application> findByIdAndStudent(Long id, Student student);
    long countByStudent(Student student);
    long countByStudentAndStatus(Student student, Application.Status status);
    long countByJob(Job job);
    boolean existsByStudentAndJobId(Student student, Long jobId);
}
