package com.workerconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "worker_id", nullable = false)
    private User worker;

    private String title;

    @Column(name = "job_description", length = 1000)
    private String jobDescription;

    private String location;

    private String city;

    private String pincode;

    @Column(name = "wage_per_day")
    private Double wagePerDay;

    @Column(name = "num_helpers_needed")
    private Integer numHelpersNeeded;

    @Column(name = "job_date")
    private LocalDate jobDate;

    private String category;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.OPEN;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum Status {
        OPEN, CLOSED, COMPLETED
    }
}
