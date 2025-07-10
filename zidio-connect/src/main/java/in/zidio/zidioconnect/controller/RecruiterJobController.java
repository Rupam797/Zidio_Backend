package in.zidio.zidioconnect.controller;

import in.zidio.zidioconnect.model.Job;
import in.zidio.zidioconnect.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/recruiter")
@CrossOrigin
public class RecruiterJobController {

    @Autowired
    private JobService jobService;

    @PostMapping("/jobs")
    public ResponseEntity<Job> postJob(@RequestBody Job job, Principal principal) {
        return ResponseEntity.ok(jobService.postJob(job, principal.getName()));
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> getMyJobs(Principal principal) {
        return ResponseEntity.ok(jobService.getJobsByRecruiter(principal.getName()));
    }
}
