package com.onecampus.lostfound.repository;

import com.onecampus.lostfound.entity.LostFoundItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LostFoundItemRepository extends JpaRepository<LostFoundItem, String> {
    List<LostFoundItem> findByTypeAndStatus(LostFoundItem.Type type, LostFoundItem.Status status);
    List<LostFoundItem> findByStatus(LostFoundItem.Status status);
    List<LostFoundItem> findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(String title, String location);
    List<LostFoundItem> findByCampusId(String campusId);
}

