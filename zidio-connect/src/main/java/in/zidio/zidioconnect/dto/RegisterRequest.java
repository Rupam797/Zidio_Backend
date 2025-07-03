package in.zidio.zidioconnect.dto;

public class RegisterRequest {
    private String name;           // Student/Recruiter name
    private String email;          // Unique
    private String username;       // Optional
    private String password;
    private String role;           // "STUDENT" or "RECRUITER"

    private String resumeUrl;      // Student
    private String companyName;    // Recruiter
    private String companyWebsite; // Recruiter

    // Getters and Setters

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getUsername() { return username; }

    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }

    public void setRole(String role) { this.role = role; }

    public String getResumeUrl() { return resumeUrl; }

    public void setResumeUrl(String resumeUrl) { this.resumeUrl = resumeUrl; }

    public String getCompanyName() { return companyName; }

    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getCompanyWebsite() { return companyWebsite; }

    public void setCompanyWebsite(String companyWebsite) { this.companyWebsite = companyWebsite; }
}
