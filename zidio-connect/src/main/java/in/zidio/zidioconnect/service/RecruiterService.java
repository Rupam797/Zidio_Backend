package in.zidio.zidioconnect.service;

import in.zidio.zidioconnect.dto.RecruiterProfileDTO;
import in.zidio.zidioconnect.model.Recruiter;
import in.zidio.zidioconnect.repository.RecruiterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class RecruiterService {

    @Autowired
    private RecruiterRepository recruiterRepo;

    public RecruiterProfileDTO getProfile(String email) {
        Recruiter recruiter = recruiterRepo.findByUserEmail(email);

        RecruiterProfileDTO dto = new RecruiterProfileDTO();
        dto.setEmail(recruiter.getUser().getEmail());
        dto.setCompanyName(recruiter.getCompanyName());
        dto.setCompanyWebsite(recruiter.getCompanyWebsite());
        dto.setProfilePictureUrl(recruiter.getProfilePictureUrl());
        return dto;
    }

    public String updateProfile(String email, RecruiterProfileDTO dto) {
        Recruiter recruiter = recruiterRepo.findByUserEmail(email);
        recruiter.setCompanyName(dto.getCompanyName());
        recruiter.setCompanyWebsite(dto.getCompanyWebsite());
        recruiterRepo.save(recruiter);
        return "Recruiter profile updated";
    }

    public String uploadProfilePicture(String email, MultipartFile file) throws IOException {
        Recruiter recruiter = recruiterRepo.findByUserEmail(email);
        String imageUrl = "/uploads/recruiter-profiles/" + file.getOriginalFilename();
        recruiter.setProfilePictureUrl(imageUrl);
        recruiterRepo.save(recruiter);
        return "Profile picture uploaded";
    }
}
