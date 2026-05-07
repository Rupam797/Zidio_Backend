package in.zidio.zidioconnect.service;

import in.zidio.zidioconnect.dto.RecruiterProfileDTO;
import in.zidio.zidioconnect.model.Recruiter;
import in.zidio.zidioconnect.repository.RecruiterRepository;
import in.zidio.zidioconnect.util.CloudinaryFileUploader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class RecruiterService {

    @Autowired
    private RecruiterRepository recruiterRepo;

    @Autowired
    private CloudinaryFileUploader cloudinaryFileUploader;

    public RecruiterProfileDTO getProfile(String email) {
        Recruiter recruiter = recruiterRepo.findByUserEmail(email);

        RecruiterProfileDTO dto = new RecruiterProfileDTO();
        dto.setName(recruiter.getName() != null ? recruiter.getName() : recruiter.getCompanyName());
        dto.setEmail(recruiter.getUser().getEmail());
        dto.setCompanyName(recruiter.getCompanyName());
        dto.setCompanyWebsite(recruiter.getCompanyWebsite());
        dto.setProfilePictureUrl(recruiter.getProfilePictureUrl());
        dto.setBackgroundPictureUrl(recruiter.getBackgroundPictureUrl());
        return dto;
    }

    public String updateProfile(String email, RecruiterProfileDTO dto) {
        Recruiter recruiter = recruiterRepo.findByUserEmail(email);
        if (dto.getName() != null) {
            recruiter.setName(dto.getName());
        }
        recruiter.setCompanyName(dto.getCompanyName());
        recruiter.setCompanyWebsite(dto.getCompanyWebsite());
        recruiterRepo.save(recruiter);
        return "Recruiter profile updated";
    }

    public String uploadProfilePicture(String email, MultipartFile file) throws IOException {
        Recruiter recruiter = recruiterRepo.findByUserEmail(email);

        // ✅ Upload to Cloudinary
        String imageUrl = cloudinaryFileUploader.upload(file);

        recruiter.setProfilePictureUrl(imageUrl);
        recruiterRepo.save(recruiter);
        return "Profile picture uploaded successfully";
    }

    public String uploadBackgroundPicture(String email, MultipartFile file) throws IOException {
        Recruiter recruiter = recruiterRepo.findByUserEmail(email);

        // ✅ Upload to Cloudinary
        String imageUrl = cloudinaryFileUploader.upload(file);

        recruiter.setBackgroundPictureUrl(imageUrl);
        recruiterRepo.save(recruiter);
        return "Background picture uploaded successfully";
    }
}
