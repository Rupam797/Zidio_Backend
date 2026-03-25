package in.zidio.zidioconnect.service;

import in.zidio.zidioconnect.model.Notification;
import in.zidio.zidioconnect.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public List<Notification> getMyNotifications(String email) {
        return notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(email);
    }

    public long getUnreadCount(String email) {
        return notificationRepository.countByRecipientEmailAndIsReadFalse(email);
    }

    public void markAllRead(String email) {
        List<Notification> notifications = notificationRepository
                .findByRecipientEmailOrderByCreatedAtDesc(email);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    public void createNotification(String recipientEmail, String message, String type) {
        Notification n = new Notification();
        n.setRecipientEmail(recipientEmail);
        n.setMessage(message);
        n.setType(type);
        notificationRepository.save(n);
    }
}
