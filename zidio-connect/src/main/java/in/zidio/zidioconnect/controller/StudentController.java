package in.zidio.zidioconnect.controller;

import in.zidio.zidioconnect.dto.StudentProfileDTO;
import in.zidio.zidioconnect.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/student")
@CrossOrigin
public class StudentController {

    @Autowired
    private StudentService studentService;

    // ✅ Get logged-in student's profile using JWT
    @GetMapping("/profile")
    public ResponseEntity<StudentProfileDTO> getLoggedInStudentProfile() {
        return ResponseEntity.ok(studentService.getProfileForLoggedInUser());
    }

    // ✅ Update profile using JWT — no ID in URL
    @PutMapping("/profile")
    public ResponseEntity<String> updateProfile(@RequestBody StudentProfileDTO dto) {
        return ResponseEntity.ok(studentService.updateProfileForLoggedInUser(dto));
    }

    // ✅ Upload resume (logged-in user only)
    @PostMapping("/resume")
    public ResponseEntity<String> uploadResume(@RequestParam("file") MultipartFile file) throws Exception {
        return ResponseEntity.ok(studentService.uploadResumeForLoggedInUser(file));
    }

    // ✅ Upload profile picture (logged-in user only)
    @PostMapping("/profile-picture")
    public ResponseEntity<String> uploadProfilePicture(@RequestParam("file") MultipartFile file) throws Exception {
        return ResponseEntity.ok(studentService.uploadProfilePictureForLoggedInUser(file));
    }
}
