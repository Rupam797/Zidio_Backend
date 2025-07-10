package in.zidio.zidioconnect.repository;

import in.zidio.zidioconnect.model.Application;
import in.zidio.zidioconnect.model.Job;
import in.zidio.zidioconnect.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudent(Student student);
    List<Application> findByJob(Job job);
    boolean existsByStudentAndJob(Student student, Job job);
}
