package com.onecampus.marketplace.service;

import com.onecampus.identity.entity.Campus;
import com.onecampus.identity.entity.User;
import com.onecampus.identity.repository.CampusRepository;
import com.onecampus.identity.repository.UserRepository;
import com.onecampus.marketplace.dto.CreateMarketplaceItemRequest;
import com.onecampus.marketplace.dto.MarketplaceItemDto;
import com.onecampus.marketplace.entity.MarketplaceItem;
import com.onecampus.marketplace.repository.MarketplaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarketplaceService {

    private final MarketplaceRepository marketplaceRepository;
    private final UserRepository userRepository;
    private final CampusRepository campusRepository;

    public List<MarketplaceItemDto> getAllItems(String category) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        var user = userRepository.findByEmail(email).orElseThrow();
        String campusId = user.getCampus() != null ? user.getCampus().getId() : null;

        List<MarketplaceItem> items;
        if (category != null && !category.isEmpty() && !"All".equalsIgnoreCase(category)) {
            items = marketplaceRepository.findByCategoryAndStatus(category, MarketplaceItem.Status.AVAILABLE);
        } else {
            items = marketplaceRepository.findByStatus(MarketplaceItem.Status.AVAILABLE);
        }

        if (campusId != null) {
            items = items.stream().filter(item -> item.getCampus() != null && campusId.equals(item.getCampus().getId())).toList();
        }

        return items.stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<MarketplaceItemDto> searchItems(String query) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        var user = userRepository.findByEmail(email).orElseThrow();
        String campusId = user.getCampus() != null ? user.getCampus().getId() : null;

        List<MarketplaceItem> items = marketplaceRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);

        if (campusId != null) {
            items = items.stream().filter(item -> item.getCampus() != null && campusId.equals(item.getCampus().getId())).toList();
        }

        return items.stream().map(this::toDto).collect(Collectors.toList());
    }

    public MarketplaceItemDto getItemById(String id) {
        MarketplaceItem item = marketplaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        return toDto(item);
    }

    public MarketplaceItemDto createItem(CreateMarketplaceItemRequest request) {
        User currentUser = getCurrentUser();
        MarketplaceItem item = MarketplaceItem.builder()
                .title(request.getTitle())
                .price(request.getPrice())
                .category(request.getCategory())
                .condition(request.getCondition())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .seller(currentUser)

                .campus(currentUser.getCampus())
                .status(MarketplaceItem.Status.AVAILABLE)
                .build();

        marketplaceRepository.save(item);
        return toDto(item);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private MarketplaceItemDto toDto(MarketplaceItem item) {
        return MarketplaceItemDto.builder()
                .id(item.getId())
                .title(item.getTitle())
                .price(item.getPrice())
                .category(item.getCategory())
                .condition(item.getCondition())
                .description(item.getDescription())
                .imageUrl(item.getImageUrl())
                .sellerId(item.getSeller() != null ? item.getSeller().getId() : null)
                .sellerName(item.getSeller() != null ? item.getSeller().getName() : "Unknown")

                .status(item.getStatus().name())
                .createdAt(item.getCreatedAt())
                .build();
    }
}

