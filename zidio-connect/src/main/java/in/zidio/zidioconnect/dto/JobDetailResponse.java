package in.zidio.zidioconnect.dto;

import java.time.LocalDateTime;

public class JobDetailResponse {

    private Long id;
    private String title;
    private String description;
    private String type;
    private String location;
    private String salary;
    private String companyName;
    private String skills;
    private LocalDateTime applicationDeadline;
    private LocalDateTime createdAt;
    private boolean active;
    private String recruiterName;
    private boolean alreadyApplied;
    private boolean saved;
    private long applicantCount;
    private String timeAgo;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getSalary() { return salary; }
    public void setSalary(String salary) { this.salary = salary; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public LocalDateTime getApplicationDeadline() { return applicationDeadline; }
    public void setApplicationDeadline(LocalDateTime applicationDeadline) { this.applicationDeadline = applicationDeadline; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public String getRecruiterName() { return recruiterName; }
    public void setRecruiterName(String recruiterName) { this.recruiterName = recruiterName; }

    public boolean isAlreadyApplied() { return alreadyApplied; }
    public void setAlreadyApplied(boolean alreadyApplied) { this.alreadyApplied = alreadyApplied; }

    public boolean isSaved() { return saved; }
    public void setSaved(boolean saved) { this.saved = saved; }

    public long getApplicantCount() { return applicantCount; }
    public void setApplicantCount(long applicantCount) { this.applicantCount = applicantCount; }

    public String getTimeAgo() { return timeAgo; }
    public void setTimeAgo(String timeAgo) { this.timeAgo = timeAgo; }
}
