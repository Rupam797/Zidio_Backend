package in.zidio.zidioconnect.controller;

import in.zidio.zidioconnect.dto.JobDetailResponse;
import in.zidio.zidioconnect.dto.PagedResponse;
import in.zidio.zidioconnect.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
public class StudentJobController {

    @Autowired
    private JobService jobService;

    // Search/filter active jobs with pagination
    @GetMapping("/jobs")
    public ResponseEntity<PagedResponse<JobDetailResponse>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Principal principal) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(jobService.searchJobs(keyword, type, location, page, size, email));
    }

    // Get single job detail
    @GetMapping("/jobs/{id}")
    public ResponseEntity<JobDetailResponse> getJobDetail(@PathVariable Long id, Principal principal) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(jobService.getJobById(id, email));
    }

    // Toggle save/unsave a job (bookmark)
    @PostMapping("/jobs/{id}/save")
    public ResponseEntity<Map<String, String>> toggleSaveJob(@PathVariable Long id, Principal principal) {
        String result = jobService.toggleSaveJob(id, principal.getName());
        return ResponseEntity.ok(Map.of("message", result));
    }

    // Get all saved jobs
    @GetMapping("/jobs/saved")
    public ResponseEntity<List<JobDetailResponse>> getSavedJobs(Principal principal) {
        return ResponseEntity.ok(jobService.getSavedJobs(principal.getName()));
    }
}
