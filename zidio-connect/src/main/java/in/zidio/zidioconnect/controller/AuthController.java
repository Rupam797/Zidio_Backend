package in.zidio.zidioconnect.controller;

import in.zidio.zidioconnect.dto.*;
import in.zidio.zidioconnect.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @PostMapping("/request-otp")
    public ResponseEntity<String> requestOtp(@RequestBody OtpRequest req) {
        return ResponseEntity.ok(userService.sendOtpToEmail(req.getEmail()));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody OtpVerificationRequest req) {
        userService.verifyOtp(req.getEmail(), req.getOtp());
        return ResponseEntity.ok("OTP verified");
    }

    @PostMapping("/reset-password-otp")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordWithOtpRequest req) {
        return ResponseEntity.ok(userService.resetPasswordWithOtp(req.getEmail(), req.getNewPassword()));
    }
}
