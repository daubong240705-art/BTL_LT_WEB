package com.movieapp.backend.service;

import com.movieapp.backend.domain.Episode;
import com.movieapp.backend.domain.Movie;
import com.movieapp.backend.dto.Movie.EpisodeDTO;
import com.movieapp.backend.dto.Movie.EpisodeRequest;
import com.movieapp.backend.repository.EpisodeRepository;
import com.movieapp.backend.repository.MovieRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EpisodeService {

    private final EpisodeRepository episodeRepository;
    private final MovieRepository movieRepository;

    public EpisodeService(EpisodeRepository episodeRepository,
            MovieRepository movieRepository) {
        this.episodeRepository = episodeRepository;
        this.movieRepository = movieRepository;
    }

    // lấy list tập theo movie
    public List<EpisodeDTO> getEpisodesByMovie(Long movieId) {
        return episodeRepository.findByMovieIdOrderByEpisodeOrderAsc(movieId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // lấy episode theo slug (watch page)
    public EpisodeDTO getEpisodeBySlug(String slug) {
        Episode ep = episodeRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tập phim"));
        return mapToDTO(ep);
    }

    // tạo episode
    public EpisodeDTO createEpisode(EpisodeRequest request) {

        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy movie"));

        Episode episode = new Episode();
        updateEpisodeFields(episode, request, movie);

        return mapToDTO(episodeRepository.save(episode));
    }

    // update episode
    public EpisodeDTO updateEpisode(Long id, EpisodeRequest request) {

        Episode episode = episodeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy episode"));

        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy movie"));

        updateEpisodeFields(episode, request, movie);

        return mapToDTO(episodeRepository.save(episode));
    }

    // delete
    public void deleteEpisode(Long id) {
        episodeRepository.deleteById(id);
    }

    private EpisodeDTO mapToDTO(Episode ep) {
        return EpisodeDTO.builder()
                .id(ep.getId())
                .name(ep.getName())
                .slug(ep.getSlug())
                .videoUrl(ep.getVideoUrl())
                .episodeOrder(ep.getEpisodeOrder())
                .movieId(ep.getMovie().getId())
                .build();
    }

    private void updateEpisodeFields(Episode ep, EpisodeRequest req, Movie movie) {
        ep.setMovie(movie);
        ep.setName(req.getName());
        ep.setVideoUrl(req.getVideoUrl());
        ep.setEpisodeOrder(req.getEpisodeOrder());

        // generate slug: naruto-tap-1
        String slug = movie.getSlug() + "-tap-" + req.getEpisodeOrder();
        ep.setSlug(slug);
    }
}