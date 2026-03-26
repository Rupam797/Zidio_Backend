package in.zidio.zidioconnect.service;

import in.zidio.zidioconnect.dto.ApplicationResponse;
import in.zidio.zidioconnect.exception.BadRequestException;
import in.zidio.zidioconnect.exception.ResourceNotFoundException;
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
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

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

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public ApplicationResponse applyToJobByEmail(String email, Long jobId, String coverLetter) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Student student = studentRepo.findByUserId(user.getId());
        if (student == null) {
            throw new ResourceNotFoundException("Student profile not found. Please complete your profile first.");
        }

        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (!job.isActive()) {
            throw new BadRequestException("This job is no longer accepting applications");
        }

        if (appRepo.existsByStudentAndJob(student, job)) {
            throw new BadRequestException("You have already applied to this job");
        }

        Application app = new Application();
        app.setStudent(student);
        app.setJob(job);
        app.setStatus(Application.Status.APPLIED);
        app.setCoverLetter(coverLetter);
        app.setAppliedAt(new Date());

        Application saved = appRepo.save(app);

        // Notify the recruiter
        if (job.getRecruiter() != null && job.getRecruiter().getUser() != null) {
            String studentName = student.getName() != null ? student.getName() : email;
            notificationService.createNotification(
                job.getRecruiter().getUser().getEmail(),
                studentName + " applied for " + job.getTitle(),
                "JOB_APPLICATION"
            );
        }

        return toDTO(saved);
    }

    // Backward-compatible overload
    public ApplicationResponse applyToJobByEmail(String email, Long jobId) {
        return applyToJobByEmail(email, jobId, null);
    }

    @Transactional
    public ApplicationResponse withdrawApplication(Long applicationId, String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Student student = studentRepo.findByUserId(user.getId());
        if (student == null) {
            throw new ResourceNotFoundException("Student profile not found");
        }

        Application app = appRepo.findByIdAndStudent(applicationId, student)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        if (app.getStatus() == Application.Status.WITHDRAWN) {
            throw new BadRequestException("Application already withdrawn");
        }

        if (app.getStatus() == Application.Status.REJECTED) {
            throw new BadRequestException("Cannot withdraw a rejected application");
        }

        app.setStatus(Application.Status.WITHDRAWN);
        Application saved = appRepo.save(app);
        return toDTO(saved);
    }

    public List<ApplicationResponse> getApplicationsByEmail(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Student student = studentRepo.findByUserId(user.getId());
        if (student == null) {
            return List.of();
        }
        return appRepo.findByStudentOrderByAppliedAtDesc(student)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<Application> getApplicationsByJob(Long jobId) {
        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));
        return appRepo.findByJob(job);
    }

    public long countByStudentEmail(String email) {
        User user = userRepo.findByEmail(email).orElse(null);
        if (user == null) return 0;
        Student student = studentRepo.findByUserId(user.getId());
        if (student == null) return 0;
        return appRepo.countByStudent(student);
    }

    public long countByStudentEmailAndStatus(String email, Application.Status status) {
        User user = userRepo.findByEmail(email).orElse(null);
        if (user == null) return 0;
        Student student = studentRepo.findByUserId(user.getId());
        if (student == null) return 0;
        return appRepo.countByStudentAndStatus(student, status);
    }

    public boolean hasApplied(String email, Long jobId) {
        User user = userRepo.findByEmail(email).orElse(null);
        if (user == null) return false;
        Student student = studentRepo.findByUserId(user.getId());
        if (student == null) return false;
        return appRepo.existsByStudentAndJobId(student, jobId);
    }

    public long countByJobId(Long jobId) {
        Job job = jobRepo.findById(jobId).orElse(null);
        if (job == null) return 0;
        return appRepo.countByJob(job);
    }

    private ApplicationResponse toDTO(Application app) {
        ApplicationResponse dto = new ApplicationResponse();
        dto.setId(app.getId());
        dto.setJobId(app.getJob().getId());
        dto.setJobTitle(app.getJob().getTitle());
        dto.setCompanyName(app.getJob().getCompanyName() != null
            ? app.getJob().getCompanyName()
            : (app.getJob().getRecruiter() != null ? app.getJob().getRecruiter().getCompanyName() : ""));
        dto.setJobType(app.getJob().getType());
        dto.setJobLocation(app.getJob().getLocation());
        dto.setStatus(app.getStatus().name());
        dto.setCoverLetter(app.getCoverLetter());
        dto.setAppliedAt(app.getAppliedAt());
        dto.setUpdatedAt(app.getUpdatedAt());
        dto.setTimeAgo(formatTimeAgo(app.getAppliedAt()));
        return dto;
    }

    private String formatTimeAgo(Date date) {
        if (date == null) return "";
        long millis = System.currentTimeMillis() - date.getTime();
        long minutes = millis / 60000;
        if (minutes < 1) return "just now";
        if (minutes < 60) return minutes + "m ago";
        long hours = minutes / 60;
        if (hours < 24) return hours + "h ago";
        long days = hours / 24;
        if (days < 7) return days + "d ago";
        if (days < 30) return (days / 7) + "w ago";
        return (days / 30) + "mo ago";
    }
}
