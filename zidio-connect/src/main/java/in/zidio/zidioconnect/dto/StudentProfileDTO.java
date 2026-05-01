package in.zidio.zidioconnect.dto;

import jakarta.validation.constraints.NotBlank;

public class StudentProfileDTO {

    @NotBlank(message = "Name is required")
    private String name;
    private String email;
    private String phone;
    private String college;
    private String branch;
    private String yearOfPassing;
    private String resumeUrl;
    private String profilePictureUrl;
    private String skills;
    private String bio;
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;
    private String experience;

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getYearOfPassing() { return yearOfPassing; }
    public void setYearOfPassing(String yearOfPassing) { this.yearOfPassing = yearOfPassing; }

    public String getResumeUrl() { return resumeUrl; }
    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public String getProfilePictureUrl() { return profilePictureUrl; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public String getPortfolioUrl() { return portfolioUrl; }
    public void setPortfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }
}
