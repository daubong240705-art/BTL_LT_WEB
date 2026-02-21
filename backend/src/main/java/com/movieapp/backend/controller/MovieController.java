package com.movieapp.backend.controller;

import com.movieapp.backend.dto.Movie.MovieDTO;
import com.movieapp.backend.dto.Movie.MovieRequest;
import com.movieapp.backend.service.MovieService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    @GetMapping
    public List<MovieDTO> getAllMovies() {
        return movieService.getAllMovies();
    }

    // API: Lấy chi tiết phim bằng slug
    @GetMapping("/{slug}")
    public MovieDTO getMovieBySlug(@PathVariable("slug") String slug) {
        return movieService.getMovieBySlug(slug);
    }

    // API: THÊM PHIM MỚI
    @PostMapping
    public ResponseEntity<MovieDTO> createMovie(@RequestBody MovieRequest request) {
        MovieDTO createdMovie = movieService.createMovie(request);
        return new ResponseEntity<>(createdMovie, HttpStatus.CREATED); // Trả về mã 201 Created
    }

    // API: CẬP NHẬT PHIM (Dựa vào ID)
    @PutMapping("/{id}")
    public ResponseEntity<MovieDTO> updateMovie(@PathVariable("id") Long id, @RequestBody MovieRequest request) {
        MovieDTO updatedMovie = movieService.updateMovie(id, request);
        return ResponseEntity.ok(updatedMovie); // Trả về mã 200 OK
    }

    // API: XÓA PHIM (Dựa vào ID)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMovie(@PathVariable("id") Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.ok("Đã xóa phim thành công!");
    }
}