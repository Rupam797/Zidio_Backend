package in.zidio.zidioconnect.controller;

import in.zidio.zidioconnect.model.User;
import in.zidio.zidioconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private UserRepository userRepo;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepo.findAll());
    }

    @PutMapping("/block/{id}")
    public ResponseEntity<String> blockUser(@PathVariable Long id) {
        User user = userRepo.findById(id).orElseThrow();
        user.setEnabled(false);
        userRepo.save(user);
        return ResponseEntity.ok("User blocked");
    }

    @PutMapping("/unblock/{id}")
    public ResponseEntity<String> unblockUser(@PathVariable Long id) {
        User user = userRepo.findById(id).orElseThrow();
        user.setEnabled(true);
        userRepo.save(user);
        return ResponseEntity.ok("User unblocked");
    }
}
