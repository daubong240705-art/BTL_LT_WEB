package com.movieapp.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.movieapp.backend.dto.Movie.EpisodeDTO;
import com.movieapp.backend.dto.Movie.EpisodeRequest;
import com.movieapp.backend.dto.Movie.MovieDTO;
import com.movieapp.backend.service.EpisodeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/v1/episodes")
@CrossOrigin(origins = "*")
public class EpisodeController {

    private final EpisodeService episodeService;

    public EpisodeController(EpisodeService episodeService) {
        this.episodeService = episodeService;
    }

    @GetMapping("/movie/{id}")
    public List<EpisodeDTO> getAllEpisodeByMovie(@PathVariable("id") Long id) {
        return episodeService.getEpisodesByMovie(id);
    }

    @PostMapping
    public ResponseEntity<EpisodeDTO> postMethodName(@RequestBody EpisodeRequest request) {
        EpisodeDTO createEpisode = episodeService.createEpisode(request);
        return new ResponseEntity<>(createEpisode, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EpisodeDTO> updateEpisode(@PathVariable("id") Long id,
            @RequestBody EpisodeRequest request) {
        EpisodeDTO updaEpisode = episodeService.updateEpisode(id, request);
        return ResponseEntity.ok(updaEpisode);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEpisode(@PathVariable("id") Long id) {
        episodeService.deleteEpisode(id);
        return ResponseEntity.ok("hehe");
    }
}