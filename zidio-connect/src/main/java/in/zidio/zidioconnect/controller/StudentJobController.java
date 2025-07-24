package in.zidio.zidioconnect.controller;

import in.zidio.zidioconnect.model.Job;
import in.zidio.zidioconnect.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@CrossOrigin
public class StudentJobController {

    @Autowired
    private JobRepository jobRepository;

    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> getAllActiveJobs() {
        return ResponseEntity.ok(jobRepository.findByIsActiveTrue());
    }
}
