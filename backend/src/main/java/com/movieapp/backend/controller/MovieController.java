package com.movieapp.backend.controller;

import com.movieapp.backend.domain.RestResponse;
import com.movieapp.backend.dto.Movie.MovieDTO;
import com.movieapp.backend.dto.Movie.MovieRequest;
import com.movieapp.backend.service.MovieService;
import com.movieapp.backend.util.ResponseUtil;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.Pageable;
// import org.springframework.data.web.PageableDefault;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/movies")
@RequiredArgsConstructor
@CrossOrigin("*")
public class MovieController {

    private final MovieService movieService;

    // GET ALL (pagination)
    @GetMapping
    public ResponseEntity<RestResponse<List<MovieDTO>>> getAllMovies() {
        return ResponseUtil.success(movieService.getAllMovies());
    }

    // GET BY SLUG
    @GetMapping("/{slug}")
    public ResponseEntity<RestResponse<MovieDTO>> getMovieBySlug(@PathVariable("slug") String slug) {
        return ResponseUtil.success(movieService.getMovieBySlug(slug));
    }

    // CREATE
    @PostMapping
    public ResponseEntity<RestResponse<MovieDTO>> createMovie(
            @Valid @RequestBody MovieRequest request) {
        return ResponseUtil.created(movieService.createMovie(request));
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<RestResponse<MovieDTO>> updateMovie(
            @PathVariable("id") Long id,
            @Valid @RequestBody MovieRequest request) {
        return ResponseUtil.created(movieService.updateMovie(id, request));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable("id") Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }
}