package in.zidio.zidioconnect.service;

import in.zidio.zidioconnect.dto.JobResponse;
import in.zidio.zidioconnect.model.Job;
import in.zidio.zidioconnect.model.Recruiter;
import in.zidio.zidioconnect.repository.JobRepository;
import in.zidio.zidioconnect.repository.RecruiterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepo;

    @Autowired
    private RecruiterRepository recruiterRepo;

    public List<JobResponse> getAllActiveJobs() {
        return jobRepo.findByIsActiveTrue().stream().map(job -> {
            JobResponse dto = new JobResponse();
            dto.setId(job.getId());
            dto.setTitle(job.getTitle());
            dto.setDescription(job.getDescription());
            dto.setType(job.getType());
            dto.setActive(job.isActive());
            dto.setRecruiterName(job.getRecruiter().getCompanyName());
            return dto;
        }).collect(Collectors.toList());
    }

    public Job postJob(Job job, String email) {
        Recruiter recruiter = recruiterRepo.findByUserEmail(email);
        if (recruiter == null) throw new RuntimeException("Recruiter not found");

        job.setRecruiter(recruiter);
        job.setActive(true);
        return jobRepo.save(job);
    }

    public List<Job> getJobsByRecruiter(String email) {
        Recruiter recruiter = recruiterRepo.findByUserEmail(email);
        if (recruiter == null) throw new RuntimeException("Recruiter not found");

        return jobRepo.findByRecruiter(recruiter);
    }
}
