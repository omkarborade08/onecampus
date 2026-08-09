package com.onecampus.marketplace.repository;

import com.onecampus.marketplace.entity.MarketplaceItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MarketplaceRepository extends JpaRepository<MarketplaceItem, String> {
    List<MarketplaceItem> findByCategoryAndStatus(String category, MarketplaceItem.Status status);
    List<MarketplaceItem> findByStatus(MarketplaceItem.Status status);
    List<MarketplaceItem> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String title, String description);
    List<MarketplaceItem> findByCampusId(String campusId);
}

