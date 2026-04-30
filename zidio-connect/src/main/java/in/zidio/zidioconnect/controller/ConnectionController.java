package in.zidio.zidioconnect.controller;

import in.zidio.zidioconnect.model.Connection;
import in.zidio.zidioconnect.service.ConnectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    @Autowired
    private ConnectionService connectionService;

    // Send a connection request
    @PostMapping("/request")
    public ResponseEntity<Connection> sendRequest(@RequestBody Map<String, String> body, Principal principal) {
        String receiverEmail = body.get("receiverEmail");
        return ResponseEntity.ok(connectionService.sendRequest(principal.getName(), receiverEmail));
    }

    // Accept a connection request
    @PutMapping("/{id}/accept")
    public ResponseEntity<Connection> acceptRequest(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(connectionService.acceptRequest(id, principal.getName()));
    }

    // Decline a connection request
    @DeleteMapping("/{id}/decline")
    public ResponseEntity<Void> declineRequest(@PathVariable Long id, Principal principal) {
        connectionService.declineRequest(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    // Get pending requests for the current user
    @GetMapping("/pending")
    public ResponseEntity<List<Connection>> getPending(Principal principal) {
        return ResponseEntity.ok(connectionService.getPendingRequests(principal.getName()));
    }

    // Get all my connections
    @GetMapping
    public ResponseEntity<List<Connection>> getMyConnections(Principal principal) {
        return ResponseEntity.ok(connectionService.getMyConnections(principal.getName()));
    }

    // Get suggestions
    @GetMapping("/suggestions")
    public ResponseEntity<List<Map<String, String>>> getSuggestions(Principal principal) {
        return ResponseEntity.ok(connectionService.getSuggestions(principal.getName()));
    }
}
