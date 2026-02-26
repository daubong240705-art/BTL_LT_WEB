package com.movieapp.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.movieapp.backend.domain.Episode;

@Repository
public interface EpisodeRepository extends JpaRepository<Episode, Long> {

    // Lấy danh sách tập theo movie (sắp xếp theo thứ tự tập)
    List<Episode> findByMovieIdOrderByEpisodeOrderAsc(Long movieId);

    // Tìm theo slug
    Optional<Episode> findBySlug(String slug);

    // Kiểm tra slug đã tồn tại chưa (khi tạo/sửa)
    boolean existsBySlug(String slug);

    // Xoá toàn bộ tập của 1 movie (khi xoá movie)
    void deleteByMovieId(Long movieId);
}