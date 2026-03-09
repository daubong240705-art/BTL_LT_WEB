package com.movieapp.backend.repository;

import org.springframework.stereotype.Repository;

import com.movieapp.backend.domain.Comment;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByMovieIdOrderByCreatedAtDesc(Long movieId);
}