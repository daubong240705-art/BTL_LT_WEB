package com.movieapp.backend.repository;

import com.movieapp.backend.domain.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long>, JpaSpecificationExecutor<Movie> {
    Optional<Movie> findBySlug(String slug);

    boolean existsBySlug(String slug);

    @Query(value = """
            SELECT m.*
            FROM movies m
            WHERE (:q IS NULL OR :q = ''
                   OR m.title COLLATE utf8mb4_0900_ai_ci LIKE CONCAT('%', :q, '%'))
            ORDER BY m.created_at DESC
            """, countQuery = """
            SELECT COUNT(m.id)
            FROM movies m
            WHERE (:q IS NULL OR :q = ''
                   OR m.title COLLATE utf8mb4_0900_ai_ci LIKE CONCAT('%', :q, '%'))
            """, nativeQuery = true)
    Page<Movie> searchPublicMovies(
            @Param("q") String q,
            Pageable pageable);
}
