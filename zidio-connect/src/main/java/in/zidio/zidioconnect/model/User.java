package in.zidio.zidioconnect.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "users", uniqueConstraints = {@UniqueConstraint(columnNames = "email")})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private boolean enabled = true;

    // ✅ OTP-based reset password
    @Column(name = "otp_code")
    private String otpCode;

    @Column(name = "otp_expiry")
    private Date otpExpiry;

    // Getters and Setters

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }

    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }

    public void setRole(Role role) { this.role = role; }

    public boolean isEnabled() { return enabled; }

    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public String getOtpCode() { return otpCode; }

    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }

    public Date getOtpExpiry() { return otpExpiry; }

    public void setOtpExpiry(Date otpExpiry) { this.otpExpiry = otpExpiry; }
}
