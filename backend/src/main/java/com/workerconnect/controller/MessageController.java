package com.workerconnect.controller;

import com.workerconnect.model.*;
import com.workerconnect.repository.UserRepository;
import com.workerconnect.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final UserRepository userRepository;

    @PostMapping("/send/{receiverId}")
    public ResponseEntity<Message> sendMessage(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long receiverId,
            @RequestBody Map<String, String> body) {
        Long senderId = getUserId(userDetails);
        return ResponseEntity.ok(messageService.sendMessage(senderId, receiverId, body.get("content")));
    }

    @GetMapping("/conversation/{partnerId}")
    public ResponseEntity<List<Message>> getConversation(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long partnerId) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(messageService.getConversation(userId, partnerId));
    }

    @GetMapping("/partners")
    public ResponseEntity<List<User>> getConversationPartners(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(messageService.getConversationPartners(userId));
    }

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"))
                .getId();
    }
}
