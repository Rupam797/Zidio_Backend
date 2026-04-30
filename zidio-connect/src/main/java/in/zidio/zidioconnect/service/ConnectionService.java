package in.zidio.zidioconnect.service;

import in.zidio.zidioconnect.model.Connection;
import in.zidio.zidioconnect.model.Notification;
import in.zidio.zidioconnect.repository.ConnectionRepository;
import in.zidio.zidioconnect.repository.NotificationRepository;
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
                Map<String, String> map = new HashMap<>();
                map.put("email", u.getEmail());
                map.put("name", u.getUsername() != null ? u.getUsername() : u.getEmail());
                map.put("role", u.getRole().name());
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
}
