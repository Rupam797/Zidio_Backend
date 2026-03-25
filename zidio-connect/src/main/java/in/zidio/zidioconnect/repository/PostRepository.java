package in.zidio.zidioconnect.repository;

import in.zidio.zidioconnect.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByOrderByCreatedAtDesc();
    List<Post> findByAuthorEmailOrderByCreatedAtDesc(String email);
}
