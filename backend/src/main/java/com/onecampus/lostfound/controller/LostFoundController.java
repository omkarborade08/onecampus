package com.onecampus.lostfound.controller;

import com.onecampus.lostfound.dto.CreateLostFoundItemRequest;
import com.onecampus.lostfound.dto.LostFoundItemDto;
import com.onecampus.lostfound.dto.UpdateLostFoundItemRequest;
import com.onecampus.lostfound.service.LostFoundService;
import com.onecampus.common.service.S3Service;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lost-found")
public class LostFoundController {

    private final LostFoundService lostFoundService;
    private final S3Service s3Service;

    public LostFoundController(LostFoundService lostFoundService, S3Service s3Service) {
        this.lostFoundService = lostFoundService;
        this.s3Service = s3Service;
    }

    @GetMapping
    public ResponseEntity<List<LostFoundItemDto>> getAllItems(@RequestParam(required = false) String type) {
        return ResponseEntity.ok(lostFoundService.getAllItems(type));
    }

    @GetMapping("/search")
    public ResponseEntity<List<LostFoundItemDto>> searchItems(@RequestParam String query) {
        return ResponseEntity.ok(lostFoundService.searchItems(query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LostFoundItemDto> getItem(@PathVariable String id) {
        return ResponseEntity.ok(lostFoundService.getItemById(id));
    }

    @PostMapping
    public ResponseEntity<LostFoundItemDto> createItem(@Valid @RequestBody CreateLostFoundItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(lostFoundService.createItem(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LostFoundItemDto> updateItem(@PathVariable String id, @Valid @RequestBody UpdateLostFoundItemRequest request) {
        return ResponseEntity.ok(lostFoundService.updateItem(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable String id) {
        lostFoundService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        long maxSize = 5 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new RuntimeException("File size must be less than 5MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Only image files are allowed");
        }

        String imageUrl = s3Service.uploadFile(file, "lost-found");
        Map<String, String> response = new HashMap<>();
        response.put("imageUrl", imageUrl);
        return ResponseEntity.ok(response);
    }
}
