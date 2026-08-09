package com.onecampus.chat.controller;

import com.onecampus.chat.dto.ConversationDto;
import com.onecampus.chat.dto.MessageDto;
import com.onecampus.chat.dto.SendMessageRequest;
import com.onecampus.chat.service.ChatService;
import com.onecampus.common.service.S3Service;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;
    private final S3Service s3Service;

    public ChatController(ChatService chatService, S3Service s3Service) {
        this.chatService = chatService;
        this.s3Service = s3Service;
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDto>> getConversations() {
        return ResponseEntity.ok(chatService.getConversations());
    }

    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<List<MessageDto>> getMessages(@PathVariable String conversationId) {
        return ResponseEntity.ok(chatService.getMessages(conversationId));
    }

    @PostMapping("/messages")
    public ResponseEntity<MessageDto> sendMessage(@Valid @RequestBody SendMessageRequest request) {
        return ResponseEntity.ok(chatService.sendMessage(request));
    }

    @GetMapping("/conversations/with")
    public ResponseEntity<ConversationDto> getOrCreateConversation(@RequestParam String otherUserId) {
        return ResponseEntity.ok(chatService.getOrCreateConversation(otherUserId));
    }

    @PutMapping("/conversations/{conversationId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable String conversationId) {
        chatService.markAsRead(conversationId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        long count = chatService.getUnreadCount();
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/presence")
    public ResponseEntity<Void> updatePresence(@RequestParam String userId, @RequestParam String status) {
        chatService.updatePresence(userId, status);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        long maxSize = 1 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new RuntimeException("File size must be less than 1MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Only image files are allowed");
        }

        String imageUrl = s3Service.uploadFile(file, "chat");
        Map<String, String> response = new HashMap<>();
        response.put("imageUrl", imageUrl);
        return ResponseEntity.ok(response);
    }
}
