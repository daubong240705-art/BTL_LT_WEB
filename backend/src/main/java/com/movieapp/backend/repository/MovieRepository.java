package com.movieapp.backend.repository;

import com.movieapp.backend.domain.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    Optional<Movie> findBySlug(String slug);

    // @Query("")
    // List<Movie> findByCategoriesSlugCustom(String slug);

    @Query(value = """
            SELECT DISTINCT m.*
            FROM movies m
            JOIN movie_category mc ON m.id = mc.movie_id
            JOIN categories c ON c.id = mc.category_id
            WHERE c.slug = :slug
            """, nativeQuery = true)
    List<Movie> findMoviesByCategorySlug(@Param("slug") String slug);
}