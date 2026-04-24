package com.workerconnect.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id", nullable = false)
    private User receiver;

    @Column(nullable = false, length = 2000)
    private String content;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "is_read")
    @Builder.Default
    private Boolean isRead = false;

    @PrePersist
    protected void onCreate() {
        sentAt = LocalDateTime.now();
    }
}
