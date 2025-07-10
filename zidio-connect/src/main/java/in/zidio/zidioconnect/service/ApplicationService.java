package in.zidio.zidioconnect.service;

import in.zidio.zidioconnect.model.Application;
import in.zidio.zidioconnect.model.Job;
import in.zidio.zidioconnect.model.Student;
import in.zidio.zidioconnect.repository.ApplicationRepository;
import in.zidio.zidioconnect.repository.JobRepository;
import in.zidio.zidioconnect.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository appRepo;

    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private JobRepository jobRepo;

    public String applyToJob(Long studentId, Long jobId) {
        Student student = studentRepo.findById(studentId).orElseThrow();
        Job job = jobRepo.findById(jobId).orElseThrow();

        if (appRepo.existsByStudentAndJob(student, job)) {
            return "Already applied to this job";
        }

        Application app = new Application();
        app.setStudent(student);
        app.setJob(job);
        app.setStatus(Application.Status.APPLIED);
        appRepo.save(app);

        return "Application submitted";
    }

    public List<Application> getApplicationsByStudent(Long studentId) {
        Student student = studentRepo.findById(studentId).orElseThrow();
        return appRepo.findByStudent(student);
    }

    public List<Application> getApplicationsByJob(Long jobId) {
        Job job = jobRepo.findById(jobId).orElseThrow();
        return appRepo.findByJob(job);
    }
}
