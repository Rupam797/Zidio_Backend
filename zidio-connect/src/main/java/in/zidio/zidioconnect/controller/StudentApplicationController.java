package in.zidio.zidioconnect.controller;

import in.zidio.zidioconnect.model.Application;
import in.zidio.zidioconnect.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/student")
@CrossOrigin
public class StudentApplicationController {

    @Autowired
    private ApplicationService appService;

    // ✅ Apply to a job using JWT (email from token)
    @PostMapping("/apply/{jobId}")
    public ResponseEntity<String> applyToJob(@PathVariable Long jobId, Principal principal) {
        String email = principal.getName(); // email from JWT
        return ResponseEntity.ok(appService.applyToJobByEmail(email, jobId));
    }

    // ✅ Get all job applications for the logged-in student
    @GetMapping("/applications")
    public ResponseEntity<List<Application>> getApplications(Principal principal) {
        String email = principal.getName(); // get email from token
        return ResponseEntity.ok(appService.getApplicationsByEmail(email));
    }
}
