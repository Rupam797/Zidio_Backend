package in.zidio.zidioconnect.controller;

import in.zidio.zidioconnect.dto.JobResponse;
import in.zidio.zidioconnect.model.Job;
import in.zidio.zidioconnect.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping
    public ResponseEntity<List<JobResponse>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllActiveJobs());
    }

    @PostMapping("/post/{recruiterId}")
    public ResponseEntity<Job> postJob(@RequestBody Job job, @PathVariable Long recruiterId) {
        return ResponseEntity.ok(jobService.postJob(job, recruiterId));
    }
}
