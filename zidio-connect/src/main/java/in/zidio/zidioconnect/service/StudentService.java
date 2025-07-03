package in.zidio.zidioconnect.service;

import in.zidio.zidioconnect.dto.StudentProfileDTO;
import in.zidio.zidioconnect.model.Student;
import in.zidio.zidioconnect.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepo;

    public StudentProfileDTO getProfile(Long studentId) {
        Student s = studentRepo.findById(studentId).orElseThrow();

        StudentProfileDTO dto = new StudentProfileDTO();
        dto.setName(s.getName());
        dto.setEmail(s.getUser().getEmail());
        dto.setPhone(s.getPhone());
        dto.setCollege(s.getCollege());
        dto.setBranch(s.getBranch());
        dto.setYearOfPassing(s.getYearOfPassing());
        dto.setResumeUrl(s.getResumeUrl());
        dto.setProfilePictureUrl(s.getProfilePictureUrl());

        return dto;
    }

    public String updateProfile(Long studentId, StudentProfileDTO dto) {
        Student s = studentRepo.findById(studentId).orElseThrow();

        s.setName(dto.getName());
        s.setPhone(dto.getPhone());
        s.setCollege(dto.getCollege());
        s.setBranch(dto.getBranch());
        s.setYearOfPassing(dto.getYearOfPassing());

        studentRepo.save(s);
        return "Profile updated successfully";
    }

    public String uploadResume(Long studentId, MultipartFile file) throws IOException {
        Student student = studentRepo.findById(studentId).orElseThrow();

        // For demo: use file name. Replace with Cloudinary/file path logic as needed
        String fileUrl = "/uploads/resumes/" + file.getOriginalFilename();

        student.setResumeUrl(fileUrl);
        studentRepo.save(student);

        return "Resume uploaded";
    }

    public String uploadProfilePicture(Long studentId, MultipartFile file) throws IOException {
        Student student = studentRepo.findById(studentId).orElseThrow();

        String imageUrl = "/uploads/images/" + file.getOriginalFilename();

        student.setProfilePictureUrl(imageUrl);
        studentRepo.save(student);

        return "Profile picture uploaded";
    }
}
