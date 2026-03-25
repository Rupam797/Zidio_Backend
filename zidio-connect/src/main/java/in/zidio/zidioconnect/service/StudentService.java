package in.zidio.zidioconnect.service;

import in.zidio.zidioconnect.dto.StudentProfileDTO;
import in.zidio.zidioconnect.model.Student;
import in.zidio.zidioconnect.repository.StudentRepository;
import in.zidio.zidioconnect.util.CloudinaryFileUploader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private CloudinaryFileUploader cloudinaryFileUploader;

    // ✅ Utility to fetch the logged-in student
    public Student getLoggedInStudent() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        return studentRepo.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Student not found for email: " + email));
    }

    // ✅ Get student profile for logged-in user
    public StudentProfileDTO getProfileForLoggedInUser() {
        Student s = getLoggedInStudent();

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

    // ✅ Update profile for logged-in user
    public String updateProfileForLoggedInUser(StudentProfileDTO dto) {
        Student s = getLoggedInStudent();

        s.setName(dto.getName());
        s.setPhone(dto.getPhone());
        s.setCollege(dto.getCollege());
        s.setBranch(dto.getBranch());
        s.setYearOfPassing(dto.getYearOfPassing());

        studentRepo.save(s);
        return "Profile updated successfully";
    }

    // ✅ Upload resume to Cloudinary
    public String uploadResumeForLoggedInUser(MultipartFile file) throws IOException {
        Student student = getLoggedInStudent();

        String fileUrl = cloudinaryFileUploader.upload(file);
        student.setResumeUrl(fileUrl);
        studentRepo.save(student);

        return "Resume uploaded to Cloudinary";
    }

    // ✅ Upload profile picture to Cloudinary
    public String uploadProfilePictureForLoggedInUser(MultipartFile file) throws IOException {
        Student student = getLoggedInStudent();

        String imageUrl = cloudinaryFileUploader.upload(file);
        student.setProfilePictureUrl(imageUrl);
        studentRepo.save(student);

        return "Profile picture uploaded to Cloudinary";
    }
}
