package com.movieapp.backend.dto.Movie;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EpisodeRequest {

    private String name;
    @NotBlank(message = "Slug không đực để trống")
    private String slug;
    private String videoUrl;
    private Integer episodeOrder;
    private Long movieId;
}
