package in.zidio.zidioconnect.controller;

import in.zidio.zidioconnect.model.Application;
import in.zidio.zidioconnect.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruiter")
@CrossOrigin
public class RecruiterController {

    @Autowired
    private ApplicationService appService;

    @GetMapping("/applications/{jobId}")
    public ResponseEntity<List<Application>> getApplicationsForJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(appService.getApplicationsByJob(jobId));
    }
}
