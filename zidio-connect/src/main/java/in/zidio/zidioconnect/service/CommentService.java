package in.zidio.zidioconnect.service;

import in.zidio.zidioconnect.dto.CommentResponseDTO;
import in.zidio.zidioconnect.exception.ResourceNotFoundException;
import in.zidio.zidioconnect.exception.UnauthorizedException;
import in.zidio.zidioconnect.model.Comment;
import in.zidio.zidioconnect.model.Post;
import in.zidio.zidioconnect.repository.CommentRepository;
import in.zidio.zidioconnect.repository.PostRepository;
import in.zidio.zidioconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public CommentResponseDTO addComment(Comment comment) {
        // Validate that the post exists
        Post post = postRepository.findById(comment.getPostId())
            .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + comment.getPostId()));

        // Resolve author name
        if (comment.getAuthorName() == null || comment.getAuthorName().equals(comment.getAuthorEmail())) {
            userRepository.findByEmail(comment.getAuthorEmail())
                .ifPresent(user -> comment.setAuthorName(
                    user.getUsername() != null ? user.getUsername() : comment.getAuthorEmail()
                ));
        }

        Comment saved = commentRepository.save(comment);

        // Notify the post author (not self-comments)
        if (!post.getAuthorEmail().equals(comment.getAuthorEmail())) {
            String commenterName = comment.getAuthorName() != null ? comment.getAuthorName() : comment.getAuthorEmail();
            notificationService.createNotification(
                post.getAuthorEmail(),
                commenterName + " commented on your post",
                "COMMENT"
            );
        }

        return toDTO(saved);
    }

    public List<CommentResponseDTO> getCommentsByPost(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    @Transactional
    public void deleteComment(Long commentId, String email) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));
        if (!comment.getAuthorEmail().equals(email)) {
            throw new UnauthorizedException("You are not authorized to delete this comment");
        }
        commentRepository.deleteById(commentId);
    }

    private CommentResponseDTO toDTO(Comment comment) {
        CommentResponseDTO dto = new CommentResponseDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setAuthorEmail(comment.getAuthorEmail());
        dto.setAuthorName(comment.getAuthorName());
        dto.setPostId(comment.getPostId());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setTimeAgo(formatTimeAgo(comment.getCreatedAt()));
        return dto;
    }

    private String formatTimeAgo(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        Duration duration = Duration.between(dateTime, LocalDateTime.now());
        long minutes = duration.toMinutes();
        if (minutes < 1) return "just now";
        if (minutes < 60) return minutes + "m";
        long hours = duration.toHours();
        if (hours < 24) return hours + "h";
        long days = duration.toDays();
        if (days < 7) return days + "d";
        if (days < 30) return (days / 7) + "w";
        return (days / 30) + "mo";
    }
}
