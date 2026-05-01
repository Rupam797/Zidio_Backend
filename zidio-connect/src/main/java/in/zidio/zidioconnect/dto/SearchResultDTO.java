package in.zidio.zidioconnect.dto;

public class SearchResultDTO {

    private Long id;
    private String type;       // "JOB", "STUDENT", "RECRUITER"
    private String title;      // Name or Job Title
    private String subtitle;   // Company, College, or Skills snippet
    private String imageUrl;   // Profile picture URL
    private String extra;      // Location, type badge, etc.

    public SearchResultDTO() {}

    public SearchResultDTO(Long id, String type, String title, String subtitle, String imageUrl, String extra) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.subtitle = subtitle;
        this.imageUrl = imageUrl;
        this.extra = extra;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getExtra() { return extra; }
    public void setExtra(String extra) { this.extra = extra; }
}
