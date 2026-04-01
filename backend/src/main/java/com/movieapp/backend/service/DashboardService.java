package com.movieapp.backend.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.movieapp.backend.dto.DashboardSumary;
import com.movieapp.backend.repository.MovieRepository;
import com.movieapp.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private static final int DASHBOARD_RANKING_LIMIT = 5;

    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    public DashboardSumary getDashboardSummary() {
        long totalViews = 0;
        Long sumViewCount = movieRepository.sumAllViewCount();
        if (sumViewCount != null) {
            totalViews = sumViewCount;
        }

        var rankingPageable = PageRequest.of(0, DASHBOARD_RANKING_LIMIT);

        return new DashboardSumary(
                movieRepository.count(),
                userRepository.count(),
                totalViews,
                movieRepository.findTopMoviesByViewCount(rankingPageable),
                movieRepository.findTopMoviesByFavoriteCount(rankingPageable));
    }
}
