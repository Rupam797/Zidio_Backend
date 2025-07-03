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

    @GetMapping("/profile/{id}")
    public ResponseEntity<StudentProfileDTO> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getProfile(id));
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<String> updateProfile(@PathVariable Long id,
                                                @RequestBody StudentProfileDTO dto) {
        return ResponseEntity.ok(studentService.updateProfile(id, dto));
    }

    @PostMapping("/resume/{id}")
    public ResponseEntity<String> uploadResume(@PathVariable Long id,
                                               @RequestParam("file") MultipartFile file) throws Exception {
        return ResponseEntity.ok(studentService.uploadResume(id, file));
    }

    @PostMapping("/profile-picture/{id}")
    public ResponseEntity<String> uploadProfilePicture(@PathVariable Long id,
                                                       @RequestParam("file") MultipartFile file) throws Exception {
        return ResponseEntity.ok(studentService.uploadProfilePicture(id, file));
    }
}
