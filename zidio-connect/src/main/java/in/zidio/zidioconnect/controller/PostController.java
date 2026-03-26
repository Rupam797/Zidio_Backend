package in.zidio.zidioconnect.controller;

import in.zidio.zidioconnect.dto.CreatePostRequest;
import in.zidio.zidioconnect.dto.PagedResponse;
import in.zidio.zidioconnect.dto.PostResponseDTO;
import in.zidio.zidioconnect.model.Post;
import in.zidio.zidioconnect.service.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    // GET all posts (paginated feed)
    @GetMapping
    public ResponseEntity<PagedResponse<PostResponseDTO>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Principal principal) {
        String email = principal != null ? principal.getName() : null;
        return ResponseEntity.ok(postService.getAllPostsPaged(page, size, email));
    }

    // GET my own posts
    @GetMapping("/mine")
    public ResponseEntity<List<Post>> getMyPosts(Principal principal) {
        return ResponseEntity.ok(postService.getMyPosts(principal.getName()));
    }

    // POST create a new post
    @PostMapping
    public ResponseEntity<Post> createPost(@Valid @RequestBody CreatePostRequest request, Principal principal) {
        Post post = new Post();
        post.setContent(request.getContent());
        post.setImageUrl(request.getImageUrl());
        post.setAuthorEmail(principal.getName());
        return ResponseEntity.ok(postService.createPost(post));
    }

    // PUT like/unlike a post
    @PutMapping("/{id}/like")
    public ResponseEntity<PostResponseDTO> likePost(@PathVariable Long id, Principal principal) {
        return ResponseEntity.ok(postService.likePost(id, principal.getName()));
    }

    // DELETE a post
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id, Principal principal) {
        postService.deletePost(id, principal.getName());
        return ResponseEntity.noContent().build();
    }
}
