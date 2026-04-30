package in.zidio.zidioconnect.service;

import in.zidio.zidioconnect.dto.PagedResponse;
import in.zidio.zidioconnect.dto.PostResponseDTO;
import in.zidio.zidioconnect.exception.ResourceNotFoundException;
import in.zidio.zidioconnect.exception.UnauthorizedException;
import in.zidio.zidioconnect.model.Post;
import in.zidio.zidioconnect.model.PostLike;
import in.zidio.zidioconnect.repository.CommentRepository;
import in.zidio.zidioconnect.repository.PostLikeRepository;
import in.zidio.zidioconnect.repository.PostRepository;
import in.zidio.zidioconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostLikeRepository postLikeRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public Post createPost(Post post) {
        // Resolve author name from User table if not set
        if (post.getAuthorName() == null || post.getAuthorName().equals(post.getAuthorEmail())) {
            userRepository.findByEmail(post.getAuthorEmail())
                .ifPresent(user -> post.setAuthorName(
                    user.getUsername() != null ? user.getUsername() : post.getAuthorEmail()
                ));
        }
        return postRepository.save(post);
    }

    public PagedResponse<PostResponseDTO> getAllPostsPaged(int page, int size, String currentUserEmail) {
        Page<Post> postPage = postRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
        List<PostResponseDTO> dtos = postPage.getContent().stream()
            .map(post -> toDTO(post, currentUserEmail))
            .collect(Collectors.toList());

        return new PagedResponse<>(
            dtos,
            postPage.getNumber(),
            postPage.getSize(),
            postPage.getTotalElements(),
            postPage.getTotalPages(),
            postPage.isLast()
        );
    }

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Post> getMyPosts(String email) {
        return postRepository.findByAuthorEmailOrderByCreatedAtDesc(email);
    }

    @Transactional
    public PostResponseDTO likePost(Long postId, String userEmail) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        boolean alreadyLiked = postLikeRepository.existsByPostIdAndUserEmail(postId, userEmail);

        if (alreadyLiked) {
            // Unlike
            postLikeRepository.deleteByPostIdAndUserEmail(postId, userEmail);
            post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
        } else {
            // Like
            PostLike like = new PostLike();
            like.setPostId(postId);
            like.setUserEmail(userEmail);
            postLikeRepository.save(like);
            post.setLikeCount(post.getLikeCount() + 1);

            // Notify post author (only on like, not unlike, and not self-like)
            if (!post.getAuthorEmail().equals(userEmail)) {
                String likerName = resolveUserName(userEmail);
                notificationService.createNotification(
                    post.getAuthorEmail(),
                    likerName + " liked your post",
                    "POST_LIKE"
                );
            }
        }

        Post saved = postRepository.save(post);
        return toDTO(saved, userEmail);
    }

    @Transactional
    public void deletePost(Long postId, String email) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));
        if (!post.getAuthorEmail().equals(email)) {
            throw new UnauthorizedException("You are not authorized to delete this post");
        }
        postRepository.deleteById(postId);
    }

    // ---- Helpers ----

    private PostResponseDTO toDTO(Post post, String currentUserEmail) {
        PostResponseDTO dto = new PostResponseDTO();
        dto.setId(post.getId());
        dto.setContent(post.getContent());
        dto.setImageUrl(post.getImageUrl());
        dto.setVideoUrl(post.getVideoUrl());
        dto.setAuthorEmail(post.getAuthorEmail());
        dto.setAuthorName(post.getAuthorName());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        dto.setLikeCount(post.getLikeCount());
        dto.setCommentCount(commentRepository.countByPostId(post.getId()));
        dto.setLikedByCurrentUser(
            currentUserEmail != null && postLikeRepository.existsByPostIdAndUserEmail(post.getId(), currentUserEmail)
        );
        dto.setTimeAgo(formatTimeAgo(post.getCreatedAt()));
        return dto;
    }

    private String resolveUserName(String email) {
        return userRepository.findByEmail(email)
            .map(user -> user.getUsername() != null ? user.getUsername() : email)
            .orElse(email);
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
        if (days < 365) return (days / 30) + "mo";
        return (days / 365) + "y";
    }
}
