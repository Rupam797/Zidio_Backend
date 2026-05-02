package in.zidio.zidioconnect.repository;

import in.zidio.zidioconnect.model.ChatMessage;
import org.springframework.data.domain.Pageable;
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

    // Find all emails of users the current user has sent messages to
    @Query("SELECT DISTINCT m.receiverEmail FROM ChatMessage m WHERE m.senderEmail = :email")
    List<String> findEmailsSentTo(@Param("email") String email);

    // Find all emails of users who sent messages to the current user
    @Query("SELECT DISTINCT m.senderEmail FROM ChatMessage m WHERE m.receiverEmail = :email")
    List<String> findEmailsReceivedFrom(@Param("email") String email);

    // Get the latest message between two users — use Pageable(0,1) instead of LIMIT (LIMIT is not valid JPQL)
    @Query("SELECT m FROM ChatMessage m WHERE " +
           "(m.senderEmail = :email1 AND m.receiverEmail = :email2) OR " +
           "(m.senderEmail = :email2 AND m.receiverEmail = :email1) " +
           "ORDER BY m.timestamp DESC")
    List<ChatMessage> findLastMessageList(@Param("email1") String email1, @Param("email2") String email2, Pageable pageable);
}
