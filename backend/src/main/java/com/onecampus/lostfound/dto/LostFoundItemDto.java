package com.onecampus.lostfound.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LostFoundItemDto {
    private String id;
    private String title;
    private String category;
    private String location;
    private String date;
    private String description;
    private String imageUrl;
    private String type;
    private String status;
    private String contact;
    private String reportedByName;
    private String reportedById;
    private LocalDateTime createdAt;
}

