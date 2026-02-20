package com.movieapp.backend.controller;

import com.movieapp.backend.dto.MovieDTO;
import com.movieapp.backend.service.MovieService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/movies")
@CrossOrigin(origins = "*")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    // API: Lấy danh sách phim
    // Phương thức GET: http://localhost:8080/api/v1/movies
    @GetMapping
    public List<MovieDTO> getAllMovies() {
        return movieService.getAllMovies();
    }

    // API: Lấy chi tiết phim bằng slug
    // Phương thức GET: http://localhost:8080/api/v1/movies/{slug}
    @GetMapping("/{slug}")
    public MovieDTO getMovieBySlug(@PathVariable String slug) {
        return movieService.getMovieBySlug(slug);
    }
}