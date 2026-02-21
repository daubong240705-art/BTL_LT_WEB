package com.movieapp.backend.domain;

import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import jakarta.persistence.*;
import lombok.*;
import java.util.Set;
import java.util.HashSet;

@Entity
@Table(name = "movies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private MovieType type;

    @Enumerated(EnumType.STRING)
    private MovieStatus status;

    @Column(name = "poster_url", length = 500)
    private String posterUrl;

    @Column(name = "thumb_url", length = 500)
    private String thumbUrl;

    @Column(name = "publish_year")
    private Integer publishYear;

    @Column(name = "view_count", columnDefinition = "bigint default 0")
    private Long viewCount;

    @Column(unique = true, nullable = false)
    private String slug;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "movie_category", // bảng trung gian
            joinColumns = @JoinColumn(name = "movie_id"), // Cột khóa ngoại nối với bảng movies
            inverseJoinColumns = @JoinColumn(name = "category_id") // Cột khóa ngoại nối với bảng categories
    )
    private Set<Category> categories = new HashSet<>();
}