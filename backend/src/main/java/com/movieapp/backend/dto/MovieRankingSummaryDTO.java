package com.movieapp.backend.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MovieRankingSummaryDTO {
    private List<DashboardMovieRankingDTO> topViewedMovies;
    private List<DashboardMovieRankingDTO> topFavoritedMovies;
    private List<DashboardMovieRankingDTO> topCommentedMovies;
}
