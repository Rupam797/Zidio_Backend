package in.zidio.zidioconnect.repository;

import in.zidio.zidioconnect.model.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    boolean existsByPostIdAndUserEmail(Long postId, String userEmail);
    Optional<PostLike> findByPostIdAndUserEmail(Long postId, String userEmail);
    void deleteByPostIdAndUserEmail(Long postId, String userEmail);
    long countByPostId(Long postId);
}
