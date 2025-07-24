package in.zidio.zidioconnect.service;

import in.zidio.zidioconnect.model.Application;
import in.zidio.zidioconnect.model.Job;
import in.zidio.zidioconnect.model.Student;
import in.zidio.zidioconnect.model.User;
import in.zidio.zidioconnect.repository.ApplicationRepository;
import in.zidio.zidioconnect.repository.JobRepository;
import in.zidio.zidioconnect.repository.StudentRepository;
import in.zidio.zidioconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository appRepo;

    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private JobRepository jobRepo;

    @Autowired
    private UserRepository userRepo;

    // ✅ Apply to job using student email (JWT)
    public String applyToJobByEmail(String email, Long jobId) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Student student = studentRepo.findByUserId(user.getId());
        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (appRepo.existsByStudentAndJob(student, job)) {
            return "Already applied to this job";
        }

        Application app = new Application();
        app.setStudent(student);
        app.setJob(job);
        app.setStatus(Application.Status.APPLIED);
        app.setAppliedAt(new Date());

        appRepo.save(app);

        return "Application submitted";
    }

    // ✅ Get applications for logged-in student (via email)
    public List<Application> getApplicationsByEmail(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Student student = studentRepo.findByUserId(user.getId());
        return appRepo.findByStudent(student);
    }

    // ✅ Get applications by job (for recruiter/admin)
    public List<Application> getApplicationsByJob(Long jobId) {
        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        return appRepo.findByJob(job);
    }
}
