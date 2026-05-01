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
    public PostResponseDTO likePost(Long postId, String userEmail, String reactionType) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        java.util.Optional<PostLike> existingLike = postLikeRepository.findByPostIdAndUserEmail(postId, userEmail);

        if (existingLike.isPresent()) {
            PostLike like = existingLike.get();
            if (like.getReactionType().equals(reactionType)) {
                // Unlike (toggle off)
                postLikeRepository.delete(like);
                decrementCount(post, like.getReactionType());
            } else {
                // Change reaction
                decrementCount(post, like.getReactionType());
                like.setReactionType(reactionType);
                postLikeRepository.save(like);
                incrementCount(post, reactionType);
            }
        } else {
            // New reaction
            PostLike like = new PostLike();
            like.setPostId(postId);
            like.setUserEmail(userEmail);
            like.setReactionType(reactionType);
            postLikeRepository.save(like);
            incrementCount(post, reactionType);

            // Notify post author
            if (!post.getAuthorEmail().equals(userEmail)) {
                String likerName = resolveUserName(userEmail);
                notificationService.createNotification(
                    post.getAuthorEmail(),
                    likerName + " reacted to your post",
                    "POST_REACTION"
                );
            }
        }

        Post saved = postRepository.save(post);
        return toDTO(saved, userEmail);
    }

    private void incrementCount(Post post, String type) {
        if ("LIKE".equals(type)) post.setLikeCount(post.getLikeCount() + 1);
        else if ("CLAP".equals(type)) post.setClapCount(post.getClapCount() + 1);
        else if ("LOVE".equals(type)) post.setLoveCount(post.getLoveCount() + 1);
        else if ("SUPPORT".equals(type)) post.setSupportCount(post.getSupportCount() + 1);
        else if ("INSIGHTFUL".equals(type)) post.setInsightfulCount(post.getInsightfulCount() + 1);
        else if ("FUNNY".equals(type)) post.setFunnyCount(post.getFunnyCount() + 1);
    }

    private void decrementCount(Post post, String type) {
        if ("LIKE".equals(type)) post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
        else if ("CLAP".equals(type)) post.setClapCount(Math.max(0, post.getClapCount() - 1));
        else if ("LOVE".equals(type)) post.setLoveCount(Math.max(0, post.getLoveCount() - 1));
        else if ("SUPPORT".equals(type)) post.setSupportCount(Math.max(0, post.getSupportCount() - 1));
        else if ("INSIGHTFUL".equals(type)) post.setInsightfulCount(Math.max(0, post.getInsightfulCount() - 1));
        else if ("FUNNY".equals(type)) post.setFunnyCount(Math.max(0, post.getFunnyCount() - 1));
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
        dto.setClapCount(post.getClapCount());
        dto.setLoveCount(post.getLoveCount());
        dto.setSupportCount(post.getSupportCount());
        dto.setInsightfulCount(post.getInsightfulCount());
        dto.setFunnyCount(post.getFunnyCount());
        dto.setCommentCount(commentRepository.countByPostId(post.getId()));
        
        if (currentUserEmail != null) {
            postLikeRepository.findByPostIdAndUserEmail(post.getId(), currentUserEmail)
                .ifPresent(like -> {
                    dto.setLikedByCurrentUser(true);
                    dto.setUserReactionType(like.getReactionType());
                });
        }
        
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
