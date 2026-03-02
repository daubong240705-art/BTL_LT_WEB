package com.movieapp.backend.service;

import com.movieapp.backend.domain.Category;
import com.movieapp.backend.domain.Movie;
import com.movieapp.backend.domain.MovieStatus;
import com.movieapp.backend.domain.MovieType;
import com.movieapp.backend.dto.Category.CategoryDTO;
import com.movieapp.backend.dto.Movie.MovieDTO;
import com.movieapp.backend.dto.Movie.MovieRequest;
import com.movieapp.backend.repository.CategoryRepository;
import com.movieapp.backend.repository.MovieRepository;
import org.springframework.stereotype.Service;
import com.movieapp.backend.exception.AppException;
import com.movieapp.backend.exception.ErrorCode;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MovieService {

    private final MovieRepository movieRepository;
    private final CategoryRepository categoryRepository;

    public MovieService(MovieRepository movieRepository, CategoryRepository categoryRepository) {
        this.movieRepository = movieRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<MovieDTO> getAllMovies() {
        List<Movie> movies = movieRepository.findAll();
        return movies.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<MovieDTO> getAllMoviesBySlug(String slug) {
        List<Movie> movies = movieRepository.findMoviesByCategorySlug(slug);
        return movies.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public MovieDTO getMovieBySlug(String slug) {
        Movie movie = movieRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

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

    // thêm phim
    public MovieDTO createMovie(MovieRequest request) {

        // check slug trùng
        if (movieRepository.findBySlug(request.getSlug()).isPresent()) {
            throw new AppException(ErrorCode.MOVIE_SLUG_ALREADY_EXISTS);
        }

        Movie movie = new Movie();
        updateMovieFields(movie, request);
        movie.setViewCount(0L);

        Movie savedMovie = movieRepository.save(movie);
        return mapToDTO(savedMovie);
    }

    // SỬA PHIM
    public MovieDTO updateMovie(Long id, MovieRequest request) {

        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        // check slug nếu đổi slug
        movieRepository.findBySlug(request.getSlug())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new AppException(ErrorCode.MOVIE_SLUG_ALREADY_EXISTS);
                    }
                });

        updateMovieFields(movie, request);

        Movie updatedMovie = movieRepository.save(movie);
        return mapToDTO(updatedMovie);
    }

    public void deleteMovie(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));

        movieRepository.delete(movie);
    }

    private void updateMovieFields(Movie movie, MovieRequest request) {

        movie.setTitle(request.getTitle());
        movie.setSlug(request.getSlug());
        movie.setDescription(request.getDescription());

        // BẮT LỖI ENUM
        try {
            movie.setType(MovieType.valueOf(request.getType()));
            movie.setStatus(MovieStatus.valueOf(request.getStatus()));
        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_ENUM_VALUE);
        }

        movie.setPosterUrl(request.getPosterUrl());
        movie.setThumbUrl(request.getThumbUrl());
        movie.setPublishYear(request.getPublishYear());

        // CHECK CATEGORY EXIST
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {

            List<Category> categories = categoryRepository.findAllById(request.getCategoryIds());

            // nếu thiếu category
            if (categories.size() != request.getCategoryIds().size()) {
                throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
            }

            movie.setCategories(new HashSet<>(categories));
        } else {
            movie.setCategories(new HashSet<>());
        }
    }
}