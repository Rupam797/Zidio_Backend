package in.zidio.zidioconnect.controller;

import in.zidio.zidioconnect.dto.DashboardStatsResponse;
import in.zidio.zidioconnect.dto.StudentProfileDTO;
import in.zidio.zidioconnect.model.Application;
import in.zidio.zidioconnect.model.Connection;
import in.zidio.zidioconnect.repository.ConnectionRepository;
import in.zidio.zidioconnect.service.ApplicationService;
import in.zidio.zidioconnect.service.JobService;
import in.zidio.zidioconnect.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private JobService jobService;

    @Autowired
    private ConnectionRepository connectionRepo;

    // ---- Profile ----

    @GetMapping("/profile")
    public ResponseEntity<StudentProfileDTO> getLoggedInStudentProfile() {
        return ResponseEntity.ok(studentService.getProfileForLoggedInUser());
    }

    @PutMapping("/profile")
    public ResponseEntity<String> updateProfile(@Valid @RequestBody StudentProfileDTO dto) {
        return ResponseEntity.ok(studentService.updateProfileForLoggedInUser(dto));
    }

    @PostMapping("/resume")
    public ResponseEntity<String> uploadResume(@RequestParam("file") MultipartFile file) throws Exception {
        return ResponseEntity.ok(studentService.uploadResumeForLoggedInUser(file));
    }

    @PostMapping("/profile-picture")
    public ResponseEntity<String> uploadProfilePicture(@RequestParam("file") MultipartFile file) throws Exception {
        return ResponseEntity.ok(studentService.uploadProfilePictureForLoggedInUser(file));
    }

    // ---- Dashboard ----

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats(Principal principal) {
        String email = principal.getName();

        DashboardStatsResponse stats = new DashboardStatsResponse();
        stats.setTotalApplications(applicationService.countByStudentEmail(email));
        stats.setShortlisted(applicationService.countByStudentEmailAndStatus(email, Application.Status.SHORTLISTED));
        stats.setRejected(applicationService.countByStudentEmailAndStatus(email, Application.Status.REJECTED));
        stats.setPending(applicationService.countByStudentEmailAndStatus(email, Application.Status.APPLIED));
        stats.setSavedJobs(jobService.countSavedJobs(email));
        stats.setConnections(connectionRepo.findBySenderEmailOrReceiverEmail(email, email).stream()
            .filter(c -> c.getStatus() == Connection.Status.ACCEPTED)
            .count());
        stats.setProfileViews(0); // placeholder

        return ResponseEntity.ok(stats);
    }
}
