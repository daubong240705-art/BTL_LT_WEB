package com.movieapp.backend.service;

import com.movieapp.backend.domain.Category;
import com.movieapp.backend.domain.Movie;
import com.movieapp.backend.dto.Movie.MovieDTO;
import com.movieapp.backend.dto.Movie.MovieRequest;
import com.movieapp.backend.repository.CategoryRepository;
import com.movieapp.backend.repository.MovieRepository;
import com.movieapp.backend.service.error.BadRequestException;
import com.movieapp.backend.service.error.ResourceNotFoundException;
import com.movieapp.backend.service.mapper.MovieMapper;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;


@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;
    private final CategoryRepository categoryRepository;
    private final MovieMapper movieMapper;

    // =========================
    // GET ALL
    // =========================
    public List<MovieDTO> getAllMovies() {
        return movieRepository.findAll()
                .stream()
                .map(movieMapper::toDTO)
                .toList();
    }

    // =========================
    // GET BY SLUG
    // =========================
    @Transactional
    public MovieDTO getMovieBySlug(String slug) {

        Movie movie = movieRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phim slug = " + slug));

        movie.setViewCount(movie.getViewCount() + 1);

        return movieMapper.toDTO(movie);
    }

    // =========================
    // CREATE
    // =========================
    @Transactional
    public MovieDTO createMovie(MovieRequest request) {

        if (movieRepository.existsBySlug(request.getSlug())) {
            throw new BadRequestException("Slug đã tồn tại");
        }

        Movie movie = movieMapper.toEntity(request);
        movie.setViewCount(0L);

        setCategories(movie, request);

        return movieMapper.toDTO(movieRepository.save(movie));
    }

    // =========================
    // UPDATE
    // =========================
    @Transactional
    public MovieDTO updateMovie(Long id, MovieRequest request) {

        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phim id = " + id));

        // Nếu đổi slug thì check trùng
        if (!movie.getSlug().equals(request.getSlug())
                && movieRepository.existsBySlug(request.getSlug())) {
            throw new BadRequestException("Slug đã tồn tại");
        }

        movieMapper.updateMovieFromRequest(request, movie);

        setCategories(movie, request);

        return movieMapper.toDTO(movie);
    }

    // =========================
    // DELETE
    // =========================
    @Transactional
    public void deleteMovie(Long id) {

        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phim id = " + id));

        movieRepository.delete(movie);
    }

    // =========================
    // CATEGORY HANDLER
    // =========================
    private void setCategories(Movie movie, MovieRequest request) {

        if (request.getCategoryIds() == null || request.getCategoryIds().isEmpty()) {
            movie.setCategories(new HashSet<>());
            return;
        }

        List<Category> categories = categoryRepository.findAllById(request.getCategoryIds());

        if (categories.size() != request.getCategoryIds().size()) {
            throw new BadRequestException("Some categories not found");
        }

        movie.setCategories(new HashSet<>(categories));
    }
}