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
import java.util.Map;
import java.util.HashMap;
import org.springframework.web.multipart.MultipartFile;
import in.zidio.zidioconnect.util.CloudinaryFileUploader;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private CloudinaryFileUploader cloudinaryFileUploader;

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
        post.setVideoUrl(request.getVideoUrl());
        post.setAuthorEmail(principal.getName());
        return ResponseEntity.ok(postService.createPost(post));
    }

    // POST upload media for a post
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadMedia(@RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = cloudinaryFileUploader.upload(file);
            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
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
