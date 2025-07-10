package in.zidio.zidioconnect.controller;

import in.zidio.zidioconnect.dto.RecruiterProfileDTO;
import in.zidio.zidioconnect.service.RecruiterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

@RestController
@RequestMapping("/api/recruiter")
@CrossOrigin
public class RecruiterProfileController {

    @Autowired
    private RecruiterService recruiterService;

    @GetMapping("/profile")
    public ResponseEntity<RecruiterProfileDTO> getProfile(Principal principal) {
        return ResponseEntity.ok(recruiterService.getProfile(principal.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<String> updateProfile(@RequestBody RecruiterProfileDTO dto, Principal principal) {
        return ResponseEntity.ok(recruiterService.updateProfile(principal.getName(), dto));
    }

    @PostMapping("/profile-picture")
    public ResponseEntity<String> uploadProfilePicture(@RequestParam("file") MultipartFile file, Principal principal) throws Exception {
        return ResponseEntity.ok(recruiterService.uploadProfilePicture(principal.getName(), file));
    }
}
