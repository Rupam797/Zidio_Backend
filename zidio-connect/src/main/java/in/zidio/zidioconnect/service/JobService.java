package in.zidio.zidioconnect.service;

import in.zidio.zidioconnect.dto.JobDetailResponse;
import in.zidio.zidioconnect.dto.JobResponse;
import in.zidio.zidioconnect.dto.PagedResponse;
import in.zidio.zidioconnect.exception.ResourceNotFoundException;
import in.zidio.zidioconnect.model.Job;
import in.zidio.zidioconnect.model.Recruiter;
import in.zidio.zidioconnect.model.SavedJob;
import in.zidio.zidioconnect.repository.JobRepository;
import in.zidio.zidioconnect.repository.RecruiterRepository;
import in.zidio.zidioconnect.repository.SavedJobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepo;

    @Autowired
    private RecruiterRepository recruiterRepo;

    @Autowired
    private SavedJobRepository savedJobRepo;

    @Autowired
    private ApplicationService applicationService;

    // ---- Public/Student-facing ----

    public PagedResponse<JobDetailResponse> searchJobs(String keyword, String type, String location,
                                                        int page, int size, String currentUserEmail) {
        Page<Job> jobPage = jobRepo.searchJobs(
            keyword != null && keyword.isBlank() ? null : keyword,
            type != null && type.isBlank() ? null : type,
            location != null && location.isBlank() ? null : location,
            PageRequest.of(page, size)
        );

        List<JobDetailResponse> dtos = jobPage.getContent().stream()
            .map(job -> toDetailDTO(job, currentUserEmail))
            .collect(Collectors.toList());

        return new PagedResponse<>(
            dtos,
            jobPage.getNumber(),
            jobPage.getSize(),
            jobPage.getTotalElements(),
            jobPage.getTotalPages(),
            jobPage.isLast()
        );
    }

    public JobDetailResponse getJobById(Long id, String currentUserEmail) {
        Job job = jobRepo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        return toDetailDTO(job, currentUserEmail);
    }

    public List<JobResponse> getAllActiveJobs() {
        return jobRepo.findByIsActiveTrue().stream().map(this::toJobResponse).collect(Collectors.toList());
    }

    // ---- Saved Jobs ----

    @Transactional
    public String toggleSaveJob(Long jobId, String email) {
        jobRepo.findById(jobId)
            .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        boolean exists = savedJobRepo.existsByStudentEmailAndJobId(email, jobId);
        if (exists) {
            savedJobRepo.deleteByStudentEmailAndJobId(email, jobId);
            return "Job unsaved";
        } else {
            SavedJob saved = new SavedJob();
            saved.setStudentEmail(email);
            saved.setJobId(jobId);
            savedJobRepo.save(saved);
            return "Job saved";
        }
    }

    public List<JobDetailResponse> getSavedJobs(String email) {
        return savedJobRepo.findByStudentEmailOrderBySavedAtDesc(email).stream()
            .map(saved -> {
                Job job = jobRepo.findById(saved.getJobId()).orElse(null);
                if (job == null) return null;
                return toDetailDTO(job, email);
            })
            .filter(dto -> dto != null)
            .collect(Collectors.toList());
    }

    public long countSavedJobs(String email) {
        return savedJobRepo.countByStudentEmail(email);
    }

    // ---- Recruiter-facing ----

    @Transactional
    public Job postJob(Job job, String email) {
        Recruiter recruiter = recruiterRepo.findByUserEmail(email);
        if (recruiter == null) throw new ResourceNotFoundException("Recruiter profile not found");

        job.setRecruiter(recruiter);
        job.setActive(true);
        // Denormalize company name
        if (job.getCompanyName() == null || job.getCompanyName().isBlank()) {
            job.setCompanyName(recruiter.getCompanyName());
        }
        return jobRepo.save(job);
    }

    public List<Job> getJobsByRecruiter(String email) {
        Recruiter recruiter = recruiterRepo.findByUserEmail(email);
        if (recruiter == null) throw new ResourceNotFoundException("Recruiter profile not found");
        return jobRepo.findByRecruiter(recruiter);
    }

    // ---- Helpers ----

    private JobDetailResponse toDetailDTO(Job job, String currentUserEmail) {
        JobDetailResponse dto = new JobDetailResponse();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setType(job.getType());
        dto.setLocation(job.getLocation());
        dto.setSalary(job.getSalary());
        dto.setCompanyName(job.getCompanyName() != null ? job.getCompanyName()
            : (job.getRecruiter() != null ? job.getRecruiter().getCompanyName() : ""));
        dto.setSkills(job.getSkills());
        dto.setApplicationDeadline(job.getApplicationDeadline());
        dto.setCreatedAt(job.getCreatedAt());
        dto.setActive(job.isActive());
        dto.setRecruiterName(job.getRecruiter() != null ? job.getRecruiter().getCompanyName() : "");
        dto.setApplicantCount(applicationService.countByJobId(job.getId()));
        dto.setTimeAgo(formatTimeAgo(job.getCreatedAt()));

        if (currentUserEmail != null) {
            dto.setAlreadyApplied(applicationService.hasApplied(currentUserEmail, job.getId()));
            dto.setSaved(savedJobRepo.existsByStudentEmailAndJobId(currentUserEmail, job.getId()));
        }

        return dto;
    }

    private JobResponse toJobResponse(Job job) {
        JobResponse dto = new JobResponse();
        dto.setId(job.getId());
        dto.setTitle(job.getTitle());
        dto.setDescription(job.getDescription());
        dto.setType(job.getType());
        dto.setActive(job.isActive());
        dto.setRecruiterName(job.getRecruiter() != null ? job.getRecruiter().getCompanyName() : "");
        return dto;
    }

    private String formatTimeAgo(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        Duration duration = Duration.between(dateTime, LocalDateTime.now());
        long minutes = duration.toMinutes();
        if (minutes < 1) return "just now";
        if (minutes < 60) return minutes + "m ago";
        long hours = duration.toHours();
        if (hours < 24) return hours + "h ago";
        long days = duration.toDays();
        if (days < 7) return days + "d ago";
        if (days < 30) return (days / 7) + "w ago";
        return (days / 30) + "mo ago";
    }
}
