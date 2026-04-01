package com.movieapp.backend.repository;

import com.movieapp.backend.domain.Movie;
import com.movieapp.backend.dto.DashboardMovieRankingDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long>, JpaSpecificationExecutor<Movie> {
       Optional<Movie> findBySlug(String slug);

       boolean existsBySlug(String slug);

       List<Movie> findTop5ByOrderByViewCountDesc();

       @Query("""
                     SELECT new com.movieapp.backend.dto.DashboardMovieRankingDTO(
                            m.id,
                            m.title,
                            m.slug,
                            m.posterUrl,
                            m.publishYear,
                            m.viewCount,
                            COUNT(DISTINCT u.id)
                     )
                     FROM Movie m
                     LEFT JOIN m.favoritedByUsers u
                     GROUP BY m.id, m.title, m.slug, m.posterUrl, m.publishYear, m.viewCount
                     ORDER BY m.viewCount DESC, COUNT(DISTINCT u.id) DESC, m.id DESC
                     """)
       List<DashboardMovieRankingDTO> findTopMoviesByViewCount(Pageable pageable);

       @Query("""
                     SELECT new com.movieapp.backend.dto.DashboardMovieRankingDTO(
                            m.id,
                            m.title,
                            m.slug,
                            m.posterUrl,
                            m.publishYear,
                            m.viewCount,
                            COUNT(DISTINCT u.id)
                     )
                     FROM Movie m
                     LEFT JOIN m.favoritedByUsers u
                     GROUP BY m.id, m.title, m.slug, m.posterUrl, m.publishYear, m.viewCount
                     ORDER BY COUNT(DISTINCT u.id) DESC, m.viewCount DESC, m.id DESC
                     """)
       List<DashboardMovieRankingDTO> findTopMoviesByFavoriteCount(Pageable pageable);

       @Query("SELECT COALESCE(SUM(m.viewCount), 0) FROM Movie m")
       Long sumAllViewCount();
}
