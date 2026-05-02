package in.zidio.zidioconnect.repository;

import in.zidio.zidioconnect.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    // Get full conversation between two users, ordered by time
    @Query("SELECT m FROM ChatMessage m WHERE " +
           "(m.senderEmail = :email1 AND m.receiverEmail = :email2) OR " +
           "(m.senderEmail = :email2 AND m.receiverEmail = :email1) " +
           "ORDER BY m.timestamp ASC")
    List<ChatMessage> findConversation(@Param("email1") String email1, @Param("email2") String email2);

    // Count unread messages from a specific sender
    @Query("SELECT COUNT(m) FROM ChatMessage m WHERE m.senderEmail = :sender AND m.receiverEmail = :receiver AND m.read = false")
    long countUnread(@Param("sender") String sender, @Param("receiver") String receiver);

    // Mark all messages from sender to receiver as read
    @Modifying
    @Transactional
    @Query("UPDATE ChatMessage m SET m.read = true WHERE m.senderEmail = :sender AND m.receiverEmail = :receiver AND m.read = false")
    void markAsRead(@Param("sender") String sender, @Param("receiver") String receiver);

    // Find distinct users the current user has chatted with
    @Query("SELECT DISTINCT CASE WHEN m.senderEmail = :email THEN m.receiverEmail ELSE m.senderEmail END " +
           "FROM ChatMessage m WHERE m.senderEmail = :email OR m.receiverEmail = :email")
    List<String> findChatPartners(@Param("email") String email);

    // Get the latest message between two users
    @Query("SELECT m FROM ChatMessage m WHERE " +
           "(m.senderEmail = :email1 AND m.receiverEmail = :email2) OR " +
           "(m.senderEmail = :email2 AND m.receiverEmail = :email1) " +
           "ORDER BY m.timestamp DESC LIMIT 1")
    ChatMessage findLastMessage(@Param("email1") String email1, @Param("email2") String email2);
}
