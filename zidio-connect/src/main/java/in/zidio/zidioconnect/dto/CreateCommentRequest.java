package in.zidio.zidioconnect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateCommentRequest {

    @NotBlank(message = "Comment content cannot be empty")
    @Size(max = 1000, message = "Comment must be under 1000 characters")
    private String content;

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
