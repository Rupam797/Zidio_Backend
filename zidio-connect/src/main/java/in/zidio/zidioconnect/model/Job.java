package in.zidio.zidioconnect.model;

import jakarta.persistence.*;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    private String type; // JOB or INTERNSHIP

    private boolean isActive = true;

    @ManyToOne
    @JoinColumn(name = "recruiter_id")
    private Recruiter recruiter;

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

    public Recruiter getRecruiter() { return recruiter; }

    public void setRecruiter(Recruiter recruiter) { this.recruiter = recruiter; }
}
