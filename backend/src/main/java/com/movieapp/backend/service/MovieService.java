package com.movieapp.backend.service;

import com.movieapp.backend.domain.Category;
import com.movieapp.backend.domain.Movie;
import com.movieapp.backend.dto.Meta;
import com.movieapp.backend.dto.ResultPaginationDTO;
import com.movieapp.backend.dto.Movie.MovieDTO;
import com.movieapp.backend.dto.Movie.MovieRequest;
import com.movieapp.backend.repository.CategoryRepository;
import com.movieapp.backend.repository.MovieRepository;
import com.movieapp.backend.service.mapper.MovieMapper;
import com.movieapp.backend.util.error.BadRequestException;
import com.movieapp.backend.util.error.CustomValidationException;
import com.movieapp.backend.util.error.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;


import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MovieService {

    private final MovieRepository movieRepository;
    private final CategoryRepository categoryRepository;
    private final MovieMapper movieMapper;

    public ResultPaginationDTO getAllMovies(Specification<Movie> spec, Pageable pageable) {
        Page<Movie> pageUser = movieRepository.findAll(spec, pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        Meta mt = new Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(pageUser.getTotalPages());
        mt.setTotal(pageUser.getTotalElements());

        rs.setMeta(mt);

        rs.setResult(pageUser.map(movieMapper::toDTO).getContent());

        return rs;
    }

    public ResultPaginationDTO searchPublicMovies(String q, Pageable pageable) {
        String keyword = q == null ? "" : q.trim();
        Page<Movie> pageMovie = movieRepository.searchPublicMovies(keyword, pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        Meta mt = new Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(pageMovie.getTotalPages());
        mt.setTotal(pageMovie.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(pageMovie.map(movieMapper::toDTO).getContent());

        return rs;
    }

    public MovieDTO getMovieById(Long id) {

        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phim slug = " + id));

        return movieMapper.toDTO(movie);
    }

    public MovieDTO getMovieBySlug(String slug) {

        Movie movie = movieRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phim slug = " + slug));

        return movieMapper.toDTO(movie);
    }

    public MovieDTO createMovie(MovieRequest request) {
        Map<String, String> errors = new HashMap<>();
        if (movieRepository.existsBySlug(request.getSlug())) {
            errors.put("slug", "Slug đã tồn tại");
        }

        if (!errors.isEmpty()) {
            throw new CustomValidationException(errors);
        }

        Movie movie = movieMapper.toEntity(request);
        movie.setViewCount(0L);

        setCategories(movie, request);

        return movieMapper.toDTO(movieRepository.save(movie));
    }

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

        return movieMapper.toDTO(movieRepository.save(movie));
    }

    public void deleteMovie(Long id) {

        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phim id = " + id));

        movieRepository.delete(movie);
    }

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
