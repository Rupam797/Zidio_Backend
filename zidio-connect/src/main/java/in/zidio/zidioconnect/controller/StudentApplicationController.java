package in.zidio.zidioconnect.controller;

import in.zidio.zidioconnect.dto.ApplicationResponse;
import in.zidio.zidioconnect.service.ApplicationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
public class StudentApplicationController {

    @Autowired
    private ApplicationService appService;

    // Apply to a job (with optional cover letter)
    @PostMapping("/apply/{jobId}")
    public ResponseEntity<ApplicationResponse> applyToJob(
            @PathVariable Long jobId,
            @RequestBody(required = false) Map<String, String> body,
            Principal principal) {
        String email = principal.getName();
        String coverLetter = body != null ? body.get("coverLetter") : null;
        return ResponseEntity.ok(appService.applyToJobByEmail(email, jobId, coverLetter));
    }

    // Get all applications for the logged-in student
    @GetMapping("/applications")
    public ResponseEntity<List<ApplicationResponse>> getApplications(Principal principal) {
        return ResponseEntity.ok(appService.getApplicationsByEmail(principal.getName()));
    }

    // Withdraw an application
    @PutMapping("/applications/{id}/withdraw")
    public ResponseEntity<ApplicationResponse> withdrawApplication(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(appService.withdrawApplication(id, principal.getName()));
    }
}
