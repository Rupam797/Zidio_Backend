package in.zidio.zidioconnect.model;

import jakarta.persistence.*;

@Entity
@Table(name = "recruiters")
public class Recruiter {

    @Id
    private Long id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;

    private String companyName;

    private String companyWebsite;

    private String profilePictureUrl;

    private String backgroundPictureUrl;

    private String name;

    // Getters and Setters

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }

    public void setUser(User user) { this.user = user; }

    public String getCompanyName() { return companyName; }

    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getCompanyWebsite() { return companyWebsite; }

    public void setCompanyWebsite(String companyWebsite) { this.companyWebsite = companyWebsite; }

    public String getProfilePictureUrl() { return profilePictureUrl; }

    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }

    public String getBackgroundPictureUrl() { return backgroundPictureUrl; }

    public void setBackgroundPictureUrl(String backgroundPictureUrl) { this.backgroundPictureUrl = backgroundPictureUrl; }
}
