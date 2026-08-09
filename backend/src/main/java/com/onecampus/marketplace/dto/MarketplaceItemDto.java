package com.onecampus.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarketplaceItemDto {
    private String id;
    private String title;
    private BigDecimal price;
    private String category;
    private String condition;
    private String description;
    private String imageUrl;
    private String sellerId;
    private String sellerName;

    private String status;
    private LocalDateTime createdAt;
}

