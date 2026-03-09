package com.movieapp.backend.controller.client;

import com.movieapp.backend.dto.Movie.CommentDTO;
import com.movieapp.backend.dto.Movie.CommentRequest;
import com.movieapp.backend.service.CommentService;
import com.movieapp.backend.util.annotation.ApiMessage;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/comments")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/movie/{movieId}")
    @ResponseStatus(HttpStatus.OK)
    @ApiMessage("Lay danh sach binh luan thanh cong")
    public List<CommentDTO> getCommentsByMovieId(@PathVariable("movieId") Long movieId) {
        return commentService.getCommentsByMovieId(movieId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @ApiMessage("Them binh luan thanh cong")
    public CommentDTO createComment(@Valid @RequestBody CommentRequest request) {
        return commentService.saveComment(request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @ApiMessage("Xoa binh luan thanh cong")
    public ResponseEntity<Void> deleteComment(@PathVariable("id") Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.ok().build();
    }
}
