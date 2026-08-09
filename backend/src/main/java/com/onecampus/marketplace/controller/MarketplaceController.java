package com.onecampus.marketplace.controller;

import com.onecampus.marketplace.dto.CreateMarketplaceItemRequest;
import com.onecampus.marketplace.dto.MarketplaceItemDto;
import com.onecampus.marketplace.service.MarketplaceService;
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
@RequestMapping("/api/marketplace")
public class MarketplaceController {

    private final MarketplaceService marketplaceService;
    private final S3Service s3Service;

    public MarketplaceController(MarketplaceService marketplaceService, S3Service s3Service) {
        this.marketplaceService = marketplaceService;
        this.s3Service = s3Service;
    }

    @GetMapping
    public ResponseEntity<List<MarketplaceItemDto>> getAllItems(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(marketplaceService.getAllItems(category));
    }

    @GetMapping("/search")
    public ResponseEntity<List<MarketplaceItemDto>> searchItems(@RequestParam String query) {
        return ResponseEntity.ok(marketplaceService.searchItems(query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MarketplaceItemDto> getItem(@PathVariable String id) {
        return ResponseEntity.ok(marketplaceService.getItemById(id));
    }

    @PostMapping
    public ResponseEntity<MarketplaceItemDto> createItem(@Valid @RequestBody CreateMarketplaceItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(marketplaceService.createItem(request));
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

        String imageUrl = s3Service.uploadFile(file, "marketplace");
        Map<String, String> response = new HashMap<>();
        response.put("imageUrl", imageUrl);
        return ResponseEntity.ok(response);
    }
}
