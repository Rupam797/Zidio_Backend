package in.zidio.zidioconnect.dto;

public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String type;
    private boolean isActive;
    private String recruiterName;

    // Getters and Setters

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }

    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }

    public void setDescription(String description) { this.description = description; }

    public String getType() { return type; }

    public void setType(String type) { this.type = type; }

    public boolean isActive() { return isActive; }

    public void setActive(boolean active) { isActive = active; }

    public String getRecruiterName() { return recruiterName; }

    public void setRecruiterName(String recruiterName) { this.recruiterName = recruiterName; }
}
