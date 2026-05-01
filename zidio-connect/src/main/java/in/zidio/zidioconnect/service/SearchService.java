package in.zidio.zidioconnect.service;

import in.zidio.zidioconnect.dto.SearchResultDTO;
import in.zidio.zidioconnect.model.Job;
import in.zidio.zidioconnect.model.Recruiter;
import in.zidio.zidioconnect.model.Student;
import in.zidio.zidioconnect.repository.JobRepository;
import in.zidio.zidioconnect.repository.RecruiterRepository;
import in.zidio.zidioconnect.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SearchService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    public List<SearchResultDTO> globalSearch(String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }

        String q = query.trim();
        List<SearchResultDTO> results = new ArrayList<>();

        // 1. Search Jobs (active only)
        try {
            var jobPage = jobRepository.searchJobs(q, "", "", PageRequest.of(0, 5));
            for (Job job : jobPage.getContent()) {
                results.add(new SearchResultDTO(
                    job.getId(),
                    "JOB",
                    job.getTitle(),
                    job.getCompanyName() != null ? job.getCompanyName() : "Unknown Company",
                    null,
                    buildJobExtra(job)
                ));
            }
        } catch (Exception e) {
            // Log but don't fail the entire search
            System.err.println("Job search error: " + e.getMessage());
        }

        // 2. Search Students
        try {
            List<Student> students = studentRepository.searchByQuery(q);
            int count = 0;
            for (Student s : students) {
                if (count >= 5) break;
                String subtitle = "";
                if (s.getCollege() != null && !s.getCollege().isEmpty()) {
                    subtitle = s.getCollege();
                    if (s.getBranch() != null && !s.getBranch().isEmpty()) {
                        subtitle += " · " + s.getBranch();
                    }
                } else if (s.getSkills() != null && !s.getSkills().isEmpty()) {
                    subtitle = s.getSkills().length() > 60
                        ? s.getSkills().substring(0, 60) + "…"
                        : s.getSkills();
                }

                results.add(new SearchResultDTO(
                    s.getId(),
                    "STUDENT",
                    s.getName() != null ? s.getName() : "Student",
                    subtitle,
                    s.getProfilePictureUrl(),
                    s.getSkills() != null ? truncateSkills(s.getSkills()) : null
                ));
                count++;
            }
        } catch (Exception e) {
            System.err.println("Student search error: " + e.getMessage());
        }

        // 3. Search Recruiters
        try {
            List<Recruiter> recruiters = recruiterRepository.searchByQuery(q);
            int count = 0;
            for (Recruiter r : recruiters) {
                if (count >= 5) break;
                String name = r.getUser() != null && r.getUser().getUsername() != null
                    ? r.getUser().getUsername()
                    : (r.getUser() != null ? r.getUser().getEmail() : "Recruiter");

                results.add(new SearchResultDTO(
                    r.getId(),
                    "RECRUITER",
                    name,
                    r.getCompanyName() != null ? r.getCompanyName() : "",
                    r.getProfilePictureUrl(),
                    r.getCompanyWebsite()
                ));
                count++;
            }
        } catch (Exception e) {
            System.err.println("Recruiter search error: " + e.getMessage());
        }

        return results;
    }

    private String buildJobExtra(Job job) {
        StringBuilder sb = new StringBuilder();
        if (job.getType() != null) sb.append(job.getType());
        if (job.getLocation() != null && !job.getLocation().isEmpty()) {
            if (sb.length() > 0) sb.append(" · ");
            sb.append(job.getLocation());
        }
        return sb.toString();
    }

    private String truncateSkills(String skills) {
        if (skills == null) return null;
        return skills.length() > 50 ? skills.substring(0, 50) + "…" : skills;
    }
}
