package in.zidio.zidioconnect.controller;

import in.zidio.zidioconnect.model.Post;
import in.zidio.zidioconnect.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    // GET all posts (feed)
    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    // GET my own posts
    @GetMapping("/mine")
    public ResponseEntity<List<Post>> getMyPosts(Principal principal) {
        return ResponseEntity.ok(postService.getMyPosts(principal.getName()));
    }

    // POST create a new post
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Map<String, String> body, Principal principal) {
        Post post = new Post();
        post.setContent(body.get("content"));
        post.setImageUrl(body.get("imageUrl"));
        post.setAuthorEmail(principal.getName());
        post.setAuthorName(body.getOrDefault("authorName", principal.getName()));
        return ResponseEntity.ok(postService.createPost(post));
    }

    // PUT like a post
    @PutMapping("/{id}/like")
    public ResponseEntity<Post> likePost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.likePost(id));
    }

    // DELETE a post
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id, Principal principal) {
        postService.deletePost(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}
