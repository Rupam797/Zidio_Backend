package in.zidio.zidioconnect.service;

import in.zidio.zidioconnect.model.*;
import in.zidio.zidioconnect.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepo;

    @Autowired
    private JobRepository jobRepo;

    @Autowired
    private StudentRepository studentRepo;

    public Application applyToJob(Long studentId, Long jobId) {
        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Application app = new Application();
        app.setStudent(student);
        app.setJob(job);
        app.setStatus(Application.Status.APPLIED);

        return applicationRepo.save(app);
    }

    public List<Application> getApplicationsByStudent(Long studentId) {
        Student student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return applicationRepo.findByStudent(student);
    }

    public List<Application> getApplicationsByJob(Long jobId) {
        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return applicationRepo.findByJob(job);
    }
}
