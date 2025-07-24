package in.zidio.zidioconnect.service;

import in.zidio.zidioconnect.model.*;
import in.zidio.zidioconnect.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AdminService {

    @Autowired private StudentRepository studentRepo;
    @Autowired private RecruiterRepository recruiterRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private JobRepository jobRepo;

    public List<Student> getAllStudents() {
        return studentRepo.findAll();
    }

    public List<Recruiter> getAllRecruiters() {
        return recruiterRepo.findAll();
    }

    public void toggleUserBlock(Long id) {
        User user = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(!user.isEnabled());
        userRepo.save(user);
    }

    public void deleteUser(Long id) {
        userRepo.deleteById(id);
    }

    public List<Job> getAllJobs() {
        return jobRepo.findAll();
    }

    public void toggleJobStatus(Long jobId) {
        Job job = jobRepo.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));
        job.setActive(!job.isActive());
        jobRepo.save(job);
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", studentRepo.count());
        stats.put("totalRecruiters", recruiterRepo.count());
        stats.put("totalJobs", jobRepo.count());
        stats.put("totalUsers", userRepo.count());
        return stats;
    }
}
