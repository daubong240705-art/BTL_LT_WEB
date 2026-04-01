package com.movieapp.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardMovieRankingDTO {
    private Long id;
    private String title;
    private String slug;
    private String posterUrl;
    private Integer publishYear;
    private Long viewCount;
    private Long favoriteCount;
}
