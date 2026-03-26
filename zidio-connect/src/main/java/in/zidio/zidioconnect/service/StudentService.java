package in.zidio.zidioconnect.service;

import in.zidio.zidioconnect.dto.StudentProfileDTO;
import in.zidio.zidioconnect.exception.ResourceNotFoundException;
import in.zidio.zidioconnect.model.Student;
import in.zidio.zidioconnect.repository.StudentRepository;
import in.zidio.zidioconnect.util.CloudinaryFileUploader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private CloudinaryFileUploader cloudinaryFileUploader;

    public Student getLoggedInStudent() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return studentRepo.findByUserEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for email: " + email));
    }

    public StudentProfileDTO getProfileForLoggedInUser() {
        Student s = getLoggedInStudent();
        return toDTO(s);
    }

    @Transactional
    public String updateProfileForLoggedInUser(StudentProfileDTO dto) {
        Student s = getLoggedInStudent();

        if (dto.getName() != null) s.setName(dto.getName());
        if (dto.getPhone() != null) s.setPhone(dto.getPhone());
        if (dto.getCollege() != null) s.setCollege(dto.getCollege());
        if (dto.getBranch() != null) s.setBranch(dto.getBranch());
        if (dto.getYearOfPassing() != null) s.setYearOfPassing(dto.getYearOfPassing());
        if (dto.getSkills() != null) s.setSkills(dto.getSkills());
        if (dto.getBio() != null) s.setBio(dto.getBio());
        if (dto.getLinkedinUrl() != null) s.setLinkedinUrl(dto.getLinkedinUrl());
        if (dto.getGithubUrl() != null) s.setGithubUrl(dto.getGithubUrl());
        if (dto.getExperience() != null) s.setExperience(dto.getExperience());

        studentRepo.save(s);
        return "Profile updated successfully";
    }

    @Transactional
    public String uploadResumeForLoggedInUser(MultipartFile file) throws IOException {
        Student student = getLoggedInStudent();
        String fileUrl = cloudinaryFileUploader.upload(file);
        student.setResumeUrl(fileUrl);
        studentRepo.save(student);
        return "Resume uploaded successfully";
    }

    @Transactional
    public String uploadProfilePictureForLoggedInUser(MultipartFile file) throws IOException {
        Student student = getLoggedInStudent();
        String imageUrl = cloudinaryFileUploader.upload(file);
        student.setProfilePictureUrl(imageUrl);
        studentRepo.save(student);
        return "Profile picture uploaded successfully";
    }

    private StudentProfileDTO toDTO(Student s) {
        StudentProfileDTO dto = new StudentProfileDTO();
        dto.setName(s.getName());
        dto.setEmail(s.getUser().getEmail());
        dto.setPhone(s.getPhone());
        dto.setCollege(s.getCollege());
        dto.setBranch(s.getBranch());
        dto.setYearOfPassing(s.getYearOfPassing());
        dto.setResumeUrl(s.getResumeUrl());
        dto.setProfilePictureUrl(s.getProfilePictureUrl());
        dto.setSkills(s.getSkills());
        dto.setBio(s.getBio());
        dto.setLinkedinUrl(s.getLinkedinUrl());
        dto.setGithubUrl(s.getGithubUrl());
        dto.setExperience(s.getExperience());
        return dto;
    }
}
