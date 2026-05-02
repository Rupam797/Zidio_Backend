package in.zidio.zidioconnect.service;

import in.zidio.zidioconnect.model.Connection;
import in.zidio.zidioconnect.model.Notification;
import in.zidio.zidioconnect.model.Student;
import in.zidio.zidioconnect.model.Recruiter;
import in.zidio.zidioconnect.repository.ConnectionRepository;
import in.zidio.zidioconnect.repository.NotificationRepository;
import in.zidio.zidioconnect.repository.StudentRepository;
import in.zidio.zidioconnect.repository.RecruiterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import in.zidio.zidioconnect.repository.UserRepository;
import in.zidio.zidioconnect.model.User;
import in.zidio.zidioconnect.model.Role;

@Service
public class ConnectionService {

    @Autowired
    private ConnectionRepository connectionRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    /**
     * Look up profile picture and display name for a user by email.
     */
    private Map<String, String> getUserProfileInfo(String email) {
        Map<String, String> info = new HashMap<>();
        info.put("email", email);
        info.put("name", email);
        info.put("profilePictureUrl", "");

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return info;

        info.put("role", user.getRole() != null ? user.getRole().name() : "");

        if (user.getRole() == Role.STUDENT) {
            studentRepository.findByUserEmail(email).ifPresent(s -> {
                if (s.getName() != null) info.put("name", s.getName());
                if (s.getProfilePictureUrl() != null) info.put("profilePictureUrl", s.getProfilePictureUrl());
            });
        } else if (user.getRole() == Role.RECRUITER) {
            Recruiter r = recruiterRepository.findByUserEmail(email);
            if (r != null) {
                String name = r.getName() != null ? r.getName() : r.getCompanyName();
                if (name != null) info.put("name", name);
                if (r.getProfilePictureUrl() != null) info.put("profilePictureUrl", r.getProfilePictureUrl());
            }
        }

        return info;
    }

    public List<Map<String, String>> getSuggestions(String currentUserEmail) {
        List<User> allUsers = userRepository.findAll();
        List<Connection> pendingConnections = connectionRepository.findBySenderEmailOrReceiverEmail(currentUserEmail, currentUserEmail);

        List<Map<String, String>> suggestions = new ArrayList<>();
        for (User u : allUsers) {
            if (u.getEmail().equals(currentUserEmail)) continue;
            if (u.getRole() == Role.ADMIN) continue;
            
            boolean exists = pendingConnections.stream().anyMatch(c -> 
                c.getSenderEmail().equals(u.getEmail()) || c.getReceiverEmail().equals(u.getEmail())
            );
            
            if (!exists) {
                Map<String, String> map = getUserProfileInfo(u.getEmail());
                suggestions.add(map);
            }
        }
        return suggestions;
    }

    public Connection sendRequest(String senderEmail, String receiverEmail) {
        // Prevent duplicate requests
        connectionRepository.findBySenderEmailAndReceiverEmail(senderEmail, receiverEmail)
                .ifPresent(c -> { throw new RuntimeException("Connection request already sent"); });

        Connection connection = new Connection();
        connection.setSenderEmail(senderEmail);
        connection.setReceiverEmail(receiverEmail);
        Connection saved = connectionRepository.save(connection);

        // Create notification
        Notification notification = new Notification();
        notification.setRecipientEmail(receiverEmail);
        notification.setMessage(senderEmail + " sent you a connection request.");
        notification.setType("CONNECTION_REQUEST");
        notificationRepository.save(notification);

        return saved;
    }

    public Connection acceptRequest(Long connectionId, String currentUserEmail) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection not found"));
        if (!connection.getReceiverEmail().equals(currentUserEmail)) {
            throw new RuntimeException("Unauthorized");
        }
        connection.setStatus(Connection.Status.ACCEPTED);
        Connection saved = connectionRepository.save(connection);

        // Notify the sender
        Notification notification = new Notification();
        notification.setRecipientEmail(connection.getSenderEmail());
        notification.setMessage(currentUserEmail + " accepted your connection request.");
        notification.setType("CONNECTION_ACCEPTED");
        notificationRepository.save(notification);

        return saved;
    }

    public void declineRequest(Long connectionId, String currentUserEmail) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() -> new RuntimeException("Connection not found"));
        if (!connection.getReceiverEmail().equals(currentUserEmail)) {
            throw new RuntimeException("Unauthorized");
        }
        connectionRepository.delete(connection);
    }

    public List<Connection> getPendingRequests(String email) {
        return connectionRepository.findByReceiverEmailAndStatus(email, Connection.Status.PENDING);
    }

    public List<Connection> getMyConnections(String email) {
        return connectionRepository.findBySenderEmailOrReceiverEmail(email, email);
    }

    /**
     * Returns enriched connection data with profile pictures, names, and roles.
     */
    public List<Map<String, Object>> getMyConnectionsEnriched(String email) {
        List<Connection> connections = connectionRepository.findBySenderEmailOrReceiverEmail(email, email);
        List<Map<String, Object>> enriched = new ArrayList<>();

        for (Connection c : connections) {
            String otherEmail = c.getSenderEmail().equals(email) ? c.getReceiverEmail() : c.getSenderEmail();
            Map<String, String> profileInfo = getUserProfileInfo(otherEmail);

            Map<String, Object> entry = new HashMap<>();
            entry.put("id", c.getId());
            entry.put("senderEmail", c.getSenderEmail());
            entry.put("receiverEmail", c.getReceiverEmail());
            entry.put("status", c.getStatus().name());
            entry.put("createdAt", c.getCreatedAt() != null ? c.getCreatedAt().toString() : "");
            entry.put("otherUserName", profileInfo.get("name"));
            entry.put("otherUserProfilePic", profileInfo.get("profilePictureUrl"));
            entry.put("otherUserRole", profileInfo.get("role"));

            enriched.add(entry);
        }
        return enriched;
    }

    /**
     * Returns enriched pending request data with profile pictures and names.
     */
    public List<Map<String, Object>> getPendingRequestsEnriched(String email) {
        List<Connection> pending = connectionRepository.findByReceiverEmailAndStatus(email, Connection.Status.PENDING);
        List<Map<String, Object>> enriched = new ArrayList<>();

        for (Connection c : pending) {
            Map<String, String> profileInfo = getUserProfileInfo(c.getSenderEmail());

            Map<String, Object> entry = new HashMap<>();
            entry.put("id", c.getId());
            entry.put("senderEmail", c.getSenderEmail());
            entry.put("receiverEmail", c.getReceiverEmail());
            entry.put("status", c.getStatus().name());
            entry.put("createdAt", c.getCreatedAt() != null ? c.getCreatedAt().toString() : "");
            entry.put("senderName", profileInfo.get("name"));
            entry.put("senderProfilePic", profileInfo.get("profilePictureUrl"));
            entry.put("senderRole", profileInfo.get("role"));

            enriched.add(entry);
        }
        return enriched;
    }
}

