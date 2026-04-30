package in.zidio.zidioconnect.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreatePostRequest {

    @NotBlank(message = "Post content cannot be empty")
    @Size(max = 3000, message = "Post content must be under 3000 characters")
    private String content;

    private String imageUrl;

    private String videoUrl;

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }
}
