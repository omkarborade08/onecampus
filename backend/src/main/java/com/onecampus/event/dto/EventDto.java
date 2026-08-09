package com.onecampus.event.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventDto {
    private String id;
    private String title;
    private String date;
    private String time;
    private String location;
    private String description;
    private String organizer;
    private int attendees;
    private String imageUrl;
    private String category;
    private LocalDateTime createdAt;
    private String creatorId;
    private boolean registered;
}

