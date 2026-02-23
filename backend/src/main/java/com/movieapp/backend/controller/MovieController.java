package com.movieapp.backend.controller;

import com.movieapp.backend.dto.Movie.MovieDTO;
import com.movieapp.backend.dto.Movie.MovieRequest;
import com.movieapp.backend.service.MovieService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
    public ResponseEntity<List<MovieDTO>> getAllMovies(
            @RequestParam("curent") Optional<String> curentOptional,
            @RequestParam("pageSize") Optional<String> pageSizeOptional) {
        String sCurent = curentOptional.isPresent() ? curentOptional.get() : "";
        String sPageSize = curentOptional.isPresent() ? pageSizeOptional.get() : "";

        return ResponseEntity.ok(movieService.getAllMovies());
    }

    // API: Lấy chi tiết phim bằng slug
    @GetMapping("/{slug}")
    public MovieDTO getMovieBySlug(@PathVariable("slug") String slug) {
        return movieService.getMovieBySlug(slug);
    }

    // API: Thêm phim
    @PostMapping
    public ResponseEntity<MovieDTO> createMovie(@RequestBody MovieRequest request) {
        MovieDTO createdMovie = movieService.createMovie(request);
        return new ResponseEntity<>(createdMovie, HttpStatus.CREATED);
    }

    // API: Cập nhật phim bằng id
    @PutMapping("/{id}")
    public ResponseEntity<MovieDTO> updateMovie(@PathVariable("id") Long id, @RequestBody MovieRequest request) {
        MovieDTO updatedMovie = movieService.updateMovie(id, request);
        return ResponseEntity.ok(updatedMovie);
    }

    // API: Xoá phim bằng id
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMovie(@PathVariable("id") Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.ok("Đã xóa phim thành công!");
    }
}