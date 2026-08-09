package com.onecampus.lostfound.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateLostFoundItemRequest {
    private String title;
    private String category;
    private String location;
    private String date;
    private String description;
    private String imageUrl;
    private String contact;
    private String status;
}

