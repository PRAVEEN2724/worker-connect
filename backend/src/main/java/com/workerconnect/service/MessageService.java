package com.workerconnect.service;

import com.workerconnect.model.*;
import com.workerconnect.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public Message sendMessage(Long senderId, Long receiverId, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .isRead(false)
                .build();

        return messageRepository.save(message);
    }

    public List<Message> getConversation(Long userId1, Long userId2) {
        return messageRepository.findConversation(userId1, userId2);
    }

    public List<User> getConversationPartners(Long userId) {
        List<Long> partnerIds = messageRepository.findConversationPartnerIds(userId);
        List<User> partners = new ArrayList<>();
        for (Long id : partnerIds) {
            userRepository.findById(id).ifPresent(partners::add);
        }
        return partners;
    }
}
