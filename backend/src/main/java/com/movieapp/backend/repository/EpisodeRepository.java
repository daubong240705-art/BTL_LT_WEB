package com.movieapp.backend.repository;

import com.movieapp.backend.domain.Episode;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface EpisodeRepository
        extends JpaRepository<Episode, Long>, JpaSpecificationExecutor<Episode> {

    boolean existsBySlug(String slug);

    Optional<Episode> findBySlug(String slug);

    List<Episode> findByMovieIdOrderByEpisodeOrderAsc(Long movieId);

    Page<Episode> findByMovieSlugOrderByEpisodeOrderAsc(String movieSlug, Pageable pageable);

}