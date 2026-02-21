package com.movieapp.backend.service;

import com.movieapp.backend.domain.Movie;
import com.movieapp.backend.dto.CategoryDTO;
import com.movieapp.backend.dto.MovieDTO;
import com.movieapp.backend.repository.MovieRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MovieService {

    private final MovieRepository movieRepository;

    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public List<MovieDTO> getAllMovies() {
        List<Movie> movies = movieRepository.findAll();
        return movies.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

  
    public MovieDTO getMovieBySlug(String slug) {
        Movie movie = movieRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bộ phim này!"));
        return mapToDTO(movie);
    }

    private MovieDTO mapToDTO(Movie movie) {
        // Chuyển đổi danh sách Category sang CategoryDTO
        List<CategoryDTO> categoryDTOs = movie.getCategories().stream()
                .map(category -> CategoryDTO.builder()
                        .id(category.getId())
                        .name(category.getName())
                        .slug(category.getSlug())
                        .build())
                .collect(Collectors.toList());

        // Chuyển đổi Movie sang MovieDTO
        return MovieDTO.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .slug(movie.getSlug())
                .description(movie.getDescription())
                .type(movie.getType().name())
                .status(movie.getStatus().name())
                .posterUrl(movie.getPosterUrl())
                .thumbUrl(movie.getThumbUrl())
                .publishYear(movie.getPublishYear())
                .viewCount(movie.getViewCount())
                .categories(categoryDTOs)
                .build();
    }
}