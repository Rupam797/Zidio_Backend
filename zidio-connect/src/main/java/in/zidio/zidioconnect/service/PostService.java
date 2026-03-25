package in.zidio.zidioconnect.service;

import in.zidio.zidioconnect.model.Post;
import in.zidio.zidioconnect.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Post> getMyPosts(String email) {
        return postRepository.findByAuthorEmailOrderByCreatedAtDesc(email);
    }

    public Post likePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setLikeCount(post.getLikeCount() + 1);
        return postRepository.save(post);
    }

    public void deletePost(Long postId, String email) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        if (!post.getAuthorEmail().equals(email)) {
            throw new RuntimeException("Unauthorized");
        }
        postRepository.deleteById(postId);
    }
}
