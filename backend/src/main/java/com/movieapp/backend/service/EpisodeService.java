package com.movieapp.backend.service;

import com.movieapp.backend.domain.Episode;
import com.movieapp.backend.domain.Movie;

import com.movieapp.backend.dto.Meta;
import com.movieapp.backend.dto.ResultPaginationDTO;
import com.movieapp.backend.dto.Movie.EpisodeDTO;
import com.movieapp.backend.dto.Movie.EpisodeRequest;
import com.movieapp.backend.repository.EpisodeRepository;
import com.movieapp.backend.repository.MovieRepository;
import com.movieapp.backend.service.mapper.EpisodeMapper;
import com.movieapp.backend.util.error.BadRequestException;
import com.movieapp.backend.util.error.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EpisodeService {

    private final EpisodeRepository episodeRepository;
    private final MovieRepository movieRepository;
    private final EpisodeMapper episodeMapper;

    public ResultPaginationDTO getAllEpisodes(
            Specification<Episode> spec,
            Pageable pageable) {

        Page<Episode> page = episodeRepository.findAll(spec, pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        Meta mt = new Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.map(episodeMapper::toDTO).getContent());

        return rs;
    }

    public EpisodeDTO getEpisodeById(Long id) {

        Episode episode = episodeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy episode id = " + id));

        return episodeMapper.toDTO(episode);
    }

    public EpisodeDTO createEpisode(EpisodeRequest request) {

        if (episodeRepository.existsBySlug(request.getSlug())) {
            throw new BadRequestException("Slug đã tồn tại");
        }

        Movie movie = movieRepository.findById(request.getMovieId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy movie"));

        Episode episode = Episode.builder()
                .name(request.getName())
                .slug(request.getSlug())
                .videoUrl(request.getVideoUrl())
                .episodeOrder(request.getEpisodeOrder())
                .movie(movie)
                .build();

        return episodeMapper.toDTO(episodeRepository.save(episode));
    }

    public EpisodeDTO updateEpisode(Long id, EpisodeRequest request) {

        Episode episode = episodeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy episode id = " + id));

        if (!episode.getSlug().equals(request.getSlug())
                && episodeRepository.existsBySlug(request.getSlug())) {

            throw new BadRequestException("Slug đã tồn tại");
        }

        episode.setName(request.getName());
        episode.setSlug(request.getSlug());
        episode.setVideoUrl(request.getVideoUrl());
        episode.setEpisodeOrder(request.getEpisodeOrder());

        return episodeMapper.toDTO(episodeRepository.save(episode));
    }

    public void deleteEpisode(Long id) {

        Episode episode = episodeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy episode id = " + id));

        episodeRepository.delete(episode);
    }

    public List<EpisodeDTO> getEpisodesByMovieId(Long movieId) {

        List<Episode> episodes = episodeRepository.findByMovieIdOrderByEpisodeOrderAsc(movieId);

        return episodes.stream()
                .map(episodeMapper::toDTO)
                .toList();
    }

    public ResultPaginationDTO getEpisodesByMovieSlug(String movieSlug,
            Pageable pageable) {

        Page<Episode> page = episodeRepository.findByMovieSlugOrderByEpisodeOrderAsc(movieSlug, pageable);


        ResultPaginationDTO rs = new ResultPaginationDTO();
        Meta mt = new Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(page.getTotalPages());
        mt.setTotal(page.getTotalElements());

        rs.setMeta(mt);
        rs.setResult(page.map(episodeMapper::toDTO).getContent());

        return rs;
    }
}