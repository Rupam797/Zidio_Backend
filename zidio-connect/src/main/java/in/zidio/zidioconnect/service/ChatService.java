package in.zidio.zidioconnect.service;

import in.zidio.zidioconnect.model.ChatMessage;
import in.zidio.zidioconnect.model.Connection;
import in.zidio.zidioconnect.model.Recruiter;
import in.zidio.zidioconnect.model.User;
import in.zidio.zidioconnect.model.Role;
import in.zidio.zidioconnect.repository.ChatMessageRepository;
import in.zidio.zidioconnect.repository.ConnectionRepository;
import in.zidio.zidioconnect.repository.StudentRepository;
import in.zidio.zidioconnect.repository.RecruiterRepository;
import in.zidio.zidioconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;


@Service
public class ChatService {

    @Autowired
    private ChatMessageRepository chatRepo;

    @Autowired
    private ConnectionRepository connectionRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private StudentRepository studentRepo;

    @Autowired
    private RecruiterRepository recruiterRepo;

    /**
     * Check if two users have an ACCEPTED connection.
     */
    public boolean areConnected(String email1, String email2) {
        List<Connection> connections = connectionRepo.findBySenderEmailOrReceiverEmail(email1, email1);
        return connections.stream().anyMatch(c ->
            c.getStatus() == Connection.Status.ACCEPTED &&
            ((c.getSenderEmail().equals(email1) && c.getReceiverEmail().equals(email2)) ||
             (c.getSenderEmail().equals(email2) && c.getReceiverEmail().equals(email1)))
        );
    }

    /**
     * Send a message. Validates that users are connected.
     */
    public ChatMessage sendMessage(String senderEmail, String receiverEmail, String content) {
        if (!areConnected(senderEmail, receiverEmail)) {
            throw new RuntimeException("Cannot send message: you are not connected with this user.");
        }

        ChatMessage msg = new ChatMessage();
        msg.setSenderEmail(senderEmail);
        msg.setReceiverEmail(receiverEmail);
        msg.setContent(content);
        msg.setTimestamp(LocalDateTime.now());
        msg.setRead(false);

        return chatRepo.save(msg);
    }

    /**
     * Get full conversation between two users.
     */
    public List<ChatMessage> getConversation(String email1, String email2) {
        return chatRepo.findConversation(email1, email2);
    }

    /**
     * Mark all messages from otherEmail to currentEmail as read.
     */
    public void markAsRead(String currentEmail, String otherEmail) {
        chatRepo.markAsRead(otherEmail, currentEmail);
    }

    /**
     * Get profile info (name + profile picture) for a user.
     */
    private Map<String, String> getProfileInfo(String email) {
        Map<String, String> info = new HashMap<>();
        info.put("email", email);
        info.put("name", email);
        info.put("profilePictureUrl", "");

        User user = userRepo.findByEmail(email).orElse(null);
        if (user == null) return info;

        info.put("role", user.getRole() != null ? user.getRole().name() : "");

        if (user.getRole() == Role.STUDENT) {
            studentRepo.findByUserEmail(email).ifPresent(s -> {
                if (s.getName() != null) info.put("name", s.getName());
                if (s.getProfilePictureUrl() != null) info.put("profilePictureUrl", s.getProfilePictureUrl());
            });
        } else if (user.getRole() == Role.RECRUITER) {
            Recruiter r = recruiterRepo.findByUserEmail(email);
            if (r != null) {
                String name = r.getName() != null ? r.getName() : r.getCompanyName();
                if (name != null) info.put("name", name);
                if (r.getProfilePictureUrl() != null) info.put("profilePictureUrl", r.getProfilePictureUrl());
            }
        }

        return info;
    }

    /**
     * Get conversation list for the current user with last message preview & unread count.
     */
    public List<Map<String, Object>> getConversationList(String email) {
        // Combine emails sent-to and received-from, deduplicated
        List<String> sentTo = chatRepo.findEmailsSentTo(email);
        List<String> receivedFrom = chatRepo.findEmailsReceivedFrom(email);
        Set<String> partnerSet = new java.util.LinkedHashSet<>();
        partnerSet.addAll(sentTo);
        partnerSet.addAll(receivedFrom);

        List<Map<String, Object>> conversations = new ArrayList<>();

        for (String partnerEmail : partnerSet) {
            List<ChatMessage> lastMsgList = chatRepo.findLastMessageList(
                email, partnerEmail, PageRequest.of(0, 1)
            );
            ChatMessage lastMsg = lastMsgList.isEmpty() ? null : lastMsgList.get(0);
            long unread = chatRepo.countUnread(partnerEmail, email);
            Map<String, String> profileInfo = getProfileInfo(partnerEmail);

            Map<String, Object> convo = new HashMap<>();
            convo.put("email", partnerEmail);
            convo.put("name", profileInfo.get("name"));
            convo.put("profilePictureUrl", profileInfo.get("profilePictureUrl"));
            convo.put("role", profileInfo.get("role"));
            convo.put("unreadCount", unread);

            if (lastMsg != null) {
                convo.put("lastMessage", lastMsg.getContent());
                convo.put("lastMessageTime", lastMsg.getTimestamp().toString());
                convo.put("lastMessageSender", lastMsg.getSenderEmail());
            }

            conversations.add(convo);
        }

        // Sort by last message time (most recent first)
        conversations.sort((a, b) -> {
            String timeA = (String) a.getOrDefault("lastMessageTime", "");
            String timeB = (String) b.getOrDefault("lastMessageTime", "");
            return timeB.compareTo(timeA);
        });

        return conversations;
    }
}
