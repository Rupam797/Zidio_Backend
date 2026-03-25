package in.zidio.zidioconnect.controller;

import in.zidio.zidioconnect.model.Comment;
import in.zidio.zidioconnect.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getCommentsByPost(postId));
    }

    @PostMapping
    public ResponseEntity<Comment> addComment(
            @PathVariable Long postId,
            @RequestBody Map<String, String> body,
            Principal principal) {
        Comment comment = new Comment();
        comment.setPostId(postId);
        comment.setContent(body.get("content"));
        comment.setAuthorEmail(principal.getName());
        comment.setAuthorName(body.getOrDefault("authorName", principal.getName()));
        return ResponseEntity.ok(commentService.addComment(comment));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId, Principal principal) {
        commentService.deleteComment(commentId, principal.getName());
        return ResponseEntity.noContent().build();
    }
}
