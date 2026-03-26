package in.zidio.zidioconnect.controller;

import in.zidio.zidioconnect.dto.CommentResponseDTO;
import in.zidio.zidioconnect.dto.CreateCommentRequest;
import in.zidio.zidioconnect.model.Comment;
import in.zidio.zidioconnect.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping
    public ResponseEntity<List<CommentResponseDTO>> getComments(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getCommentsByPost(postId));
    }

    @PostMapping
    public ResponseEntity<CommentResponseDTO> addComment(
            @PathVariable Long postId,
            @Valid @RequestBody CreateCommentRequest request,
            Principal principal) {
        Comment comment = new Comment();
        comment.setPostId(postId);
        comment.setContent(request.getContent());
        comment.setAuthorEmail(principal.getName());
        return ResponseEntity.ok(commentService.addComment(comment));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId, Principal principal) {
        commentService.deleteComment(commentId, principal.getName());
        return ResponseEntity.noContent().build();
    }
}
