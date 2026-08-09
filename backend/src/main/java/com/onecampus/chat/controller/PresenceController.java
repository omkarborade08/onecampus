package com.onecampus.chat.controller;

import com.onecampus.chat.service.PresenceService;
import com.onecampus.identity.entity.User;
import com.onecampus.identity.repository.UserRepository;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;
import java.util.Map;

@Controller
public class PresenceController {

    private final PresenceService presenceService;
    private final UserRepository userRepository;

    public PresenceController(PresenceService presenceService, UserRepository userRepository) {
        this.presenceService = presenceService;
        this.userRepository = userRepository;
    }

    @MessageMapping("/presence")
    public void handlePresence(@Payload Map<String, String> payload) {
        String userId = payload.get("userId");
        String status = payload.get("status");
        if (userId == null || status == null) return;

        if ("ONLINE".equalsIgnoreCase(status)) {
            presenceService.setOnline(userId);
            userRepository.findById(userId).ifPresent(user -> {
                user.setOnline(true);
                user.setLastSeen(LocalDateTime.now());
                userRepository.save(user);
            });
        } else if ("OFFLINE".equalsIgnoreCase(status)) {
            presenceService.setOffline(userId);
            userRepository.findById(userId).ifPresent(user -> {
                user.setOnline(false);
                user.setLastSeen(LocalDateTime.now());
                userRepository.save(user);
            });
        }
    }
}

