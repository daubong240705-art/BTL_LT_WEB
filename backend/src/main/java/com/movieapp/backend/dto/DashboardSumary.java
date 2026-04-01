package com.movieapp.backend.dto;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSumary {
    private long totalMovies;
    private long totalUsers;
    private long totalViews;
    private List<DashboardMovieRankingDTO> topViewedMovies;
    private List<DashboardMovieRankingDTO> topFavoritedMovies;
}
