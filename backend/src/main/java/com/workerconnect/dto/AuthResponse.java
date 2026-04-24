package com.workerconnect.dto;

import com.workerconnect.model.User;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private Long userId;
    private String name;
    private String email;
    private User.Role role;
}
