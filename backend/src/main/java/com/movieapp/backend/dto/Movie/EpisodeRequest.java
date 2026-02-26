package com.movieapp.backend.dto.Movie;

import lombok.Data;

@Data
public class EpisodeRequest {
    private String name;
    private String slug;
    private String videoUrl;
    private Integer episodeOrder;
    private Long movieId;
}
