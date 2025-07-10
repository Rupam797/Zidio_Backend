package in.zidio.zidioconnect.controller;

import in.zidio.zidioconnect.model.Application;
import in.zidio.zidioconnect.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@CrossOrigin
public class StudentApplicationController {

    @Autowired
    private ApplicationService appService;

    @PostMapping("/apply/{studentId}/{jobId}")
    public ResponseEntity<String> applyToJob(@PathVariable Long studentId, @PathVariable Long jobId) {
        return ResponseEntity.ok(appService.applyToJob(studentId, jobId));
    }

    @GetMapping("/applications/{studentId}")
    public ResponseEntity<List<Application>> getApplications(@PathVariable Long studentId) {
        return ResponseEntity.ok(appService.getApplicationsByStudent(studentId));
    }
}
