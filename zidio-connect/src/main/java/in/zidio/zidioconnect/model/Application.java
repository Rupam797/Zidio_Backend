package in.zidio.zidioconnect.model;

import jakarta.persistence.*;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;

    @Enumerated(EnumType.STRING)
    private Status status = Status.APPLIED;

    public enum Status {
        APPLIED,
        SHORTLISTED,
        REJECTED
    }

    // Getters and Setters

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }

    public void setStudent(Student student) { this.student = student; }

    public Job getJob() { return job; }

    public void setJob(Job job) { this.job = job; }

    public Status getStatus() { return status; }

    public void setStatus(Status status) { this.status = status; }
}
