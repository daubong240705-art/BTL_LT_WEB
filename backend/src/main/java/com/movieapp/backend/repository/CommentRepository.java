package com.movieapp.backend.repository;

import org.springframework.stereotype.Repository;

import com.movieapp.backend.domain.Comment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByMovieIdOrderByCreatedAtDesc(Long movieId, Pageable pageable);
}
