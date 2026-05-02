package in.zidio.zidioconnect.controller;

import in.zidio.zidioconnect.model.ChatMessage;
import in.zidio.zidioconnect.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * Get all conversations for the current user.
     */
    @GetMapping("/conversations")
    public ResponseEntity<List<Map<String, Object>>> getConversations(Principal principal) {
        return ResponseEntity.ok(chatService.getConversationList(principal.getName()));
    }

    /**
     * Get message history with a specific user.
     */
    @GetMapping("/history/{email}")
    public ResponseEntity<List<ChatMessage>> getHistory(@PathVariable String email, Principal principal) {
        return ResponseEntity.ok(chatService.getConversation(principal.getName(), email));
    }

    /**
     * Mark messages from a user as read.
     */
    @PutMapping("/read/{email}")
    public ResponseEntity<String> markAsRead(@PathVariable String email, Principal principal) {
        chatService.markAsRead(principal.getName(), email);
        return ResponseEntity.ok("Messages marked as read");
    }

    /**
     * WebSocket endpoint: receive a chat message via STOMP and broadcast it.
     */
    @MessageMapping("/chat.send")
    public void handleChatMessage(@Payload Map<String, String> payload, Principal principal) {
        String senderEmail = principal.getName();
        String receiverEmail = payload.get("receiverEmail");
        String content = payload.get("content");

        try {
            ChatMessage saved = chatService.sendMessage(senderEmail, receiverEmail, content);

            // Build response payload
            Map<String, Object> messagePayload = Map.of(
                "id", saved.getId(),
                "senderEmail", saved.getSenderEmail(),
                "receiverEmail", saved.getReceiverEmail(),
                "content", saved.getContent(),
                "timestamp", saved.getTimestamp().toString(),
                "read", saved.isRead()
            );

            // Send to receiver's private queue
            messagingTemplate.convertAndSendToUser(
                receiverEmail, "/queue/messages", messagePayload
            );

            // Echo back to sender's private queue
            messagingTemplate.convertAndSendToUser(
                senderEmail, "/queue/messages", messagePayload
            );
        } catch (RuntimeException e) {
            // Send error back to sender
            messagingTemplate.convertAndSendToUser(
                senderEmail, "/queue/errors",
                Map.of("error", e.getMessage())
            );
        }
    }
}
