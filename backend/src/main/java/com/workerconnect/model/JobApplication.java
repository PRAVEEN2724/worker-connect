package com.workerconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne
    @JoinColumn(name = "helper_id", nullable = false)
    private User helper;

    @Column(name = "cover_message", length = 500)
    private String coverMessage;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.PENDING;

    @Column(name = "applied_at")
    private LocalDateTime appliedAt;

    @PrePersist
    protected void onCreate() {
        appliedAt = LocalDateTime.now();
    }

    public enum Status {
        PENDING, ACCEPTED, REJECTED
    }
}
