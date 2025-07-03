package in.zidio.zidioconnect.service;

import in.zidio.zidioconnect.dto.*;
import in.zidio.zidioconnect.model.*;
import in.zidio.zidioconnect.repository.*;
import in.zidio.zidioconnect.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {

    @Autowired private UserRepository userRepo;
    @Autowired private StudentRepository studentRepo;
    @Autowired private RecruiterRepository recruiterRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private AuthenticationManager authManager;
    @Autowired private JwtTokenProvider jwtProvider;
    @Autowired private EmailService emailService;

    // 🔐 OTP request
    public String sendOtpToEmail(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String otp = String.valueOf(new Random().nextInt(900000) + 100000); // 6-digit OTP
        user.setOtpCode(otp);
        user.setOtpExpiry(new Date(System.currentTimeMillis() + 5 * 60 * 1000)); // 5 min expiry
        userRepo.save(user);

        emailService.sendOtpEmail(email, otp);
        return "OTP sent to your email.";
    }

    public boolean verifyOtp(String email, String otp) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!otp.equals(user.getOtpCode())) {
            throw new RuntimeException("Invalid OTP");
        }

        if (user.getOtpExpiry().before(new Date())) {
            throw new RuntimeException("OTP expired");
        }

        return true;
    }

    public String resetPasswordWithOtp(String email, String newPassword) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        userRepo.save(user);

        return "Password reset successfully.";
    }

    // Registration
    public String register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setUsername(req.getUsername());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole(Role.valueOf(req.getRole().toUpperCase()));
        user.setEnabled(true);
        user = userRepo.save(user);

        if (user.getRole() == Role.STUDENT) {
            Student student = new Student();
            student.setUser(user);
            student.setName(req.getName());
            student.setResumeUrl(req.getResumeUrl());
            studentRepo.save(student);
        } else if (user.getRole() == Role.RECRUITER) {
            Recruiter recruiter = new Recruiter();
            recruiter.setUser(user);
            recruiter.setCompanyName(req.getCompanyName());
            recruiter.setCompanyWebsite(req.getCompanyWebsite());
            recruiterRepo.save(recruiter);
        }

        return "Registered successfully";
    }

    // Login
    public AuthResponse login(LoginRequest req) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );

        User user = userRepo.findByEmail(req.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String token = jwtProvider.generateToken(user.getEmail());
        return new AuthResponse(token, user.getEmail(), user.getRole().name());
    }
}
