package in.zidio.zidioconnect.service;

import in.zidio.zidioconnect.model.Connection;
import in.zidio.zidioconnect.model.Notification;
import in.zidio.zidioconnect.repository.ConnectionRepository;
import in.zidio.zidioconnect.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ConnectionService {

    @Autowired
    private ConnectionRepository connectionRepository;

    @Autowired
    private NotificationRepository notificationRepository;

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

    public List<Connection> getPendingRequests(String email) {
        return connectionRepository.findByReceiverEmailAndStatus(email, Connection.Status.PENDING);
    }

    public List<Connection> getMyConnections(String email) {
        return connectionRepository.findBySenderEmailOrReceiverEmail(email, email);
    }
}
