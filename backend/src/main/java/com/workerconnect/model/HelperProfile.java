package com.workerconnect.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "helper_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HelperProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "work_types")
    private String workTypes;

    private Integer experience;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Availability availability = Availability.AVAILABLE;

    @Column(name = "profile_image_url")
    private String profileImageUrl;

    @Column(name = "average_rating")
    @Builder.Default
    private Double averageRating = 0.0;

    @Column(name = "total_ratings")
    @Builder.Default
    private Integer totalRatings = 0;

    @Column(name = "bio", length = 500)
    private String bio;

    public enum Availability {
        AVAILABLE, BUSY
    }
}
