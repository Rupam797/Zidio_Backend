package in.zidio.zidioconnect.dto;

public class RecruiterProfileDTO {

    private String name;
    private String email;
    private String companyName;
    private String companyWebsite;
    private String profilePictureUrl;
    private String backgroundPictureUrl;

    // Getters and Setters

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getCompanyName() { return companyName; }

    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getCompanyWebsite() { return companyWebsite; }

    public void setCompanyWebsite(String companyWebsite) { this.companyWebsite = companyWebsite; }

    public String getProfilePictureUrl() { return profilePictureUrl; }

    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }

    public String getBackgroundPictureUrl() { return backgroundPictureUrl; }

    public void setBackgroundPictureUrl(String backgroundPictureUrl) { this.backgroundPictureUrl = backgroundPictureUrl; }
}
