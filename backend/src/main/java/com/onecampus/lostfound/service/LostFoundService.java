package com.onecampus.lostfound.service;

import com.onecampus.identity.entity.Campus;
import com.onecampus.identity.entity.User;
import com.onecampus.identity.repository.CampusRepository;
import com.onecampus.identity.repository.UserRepository;
import com.onecampus.lostfound.dto.CreateLostFoundItemRequest;
import com.onecampus.lostfound.dto.LostFoundItemDto;
import com.onecampus.lostfound.dto.UpdateLostFoundItemRequest;
import com.onecampus.lostfound.entity.LostFoundItem;
import com.onecampus.lostfound.repository.LostFoundItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LostFoundService {

    private final LostFoundItemRepository lostFoundItemRepository;
    private final UserRepository userRepository;
    private final CampusRepository campusRepository;

    public List<LostFoundItemDto> getAllItems(String type) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        var user = userRepository.findByEmail(email).orElseThrow();
        String campusId = user.getCampus() != null ? user.getCampus().getId() : null;

        List<LostFoundItem> items;
        if (type != null && !type.isEmpty() && !"all".equalsIgnoreCase(type)) {
            LostFoundItem.Type itemType = LostFoundItem.Type.valueOf(type.toUpperCase());
            items = lostFoundItemRepository.findByTypeAndStatus(itemType, LostFoundItem.Status.OPEN);
        } else {
            items = lostFoundItemRepository.findByStatus(LostFoundItem.Status.OPEN);
        }

        if (campusId != null) {
            items = items.stream().filter(item -> item.getCampus() != null && campusId.equals(item.getCampus().getId())).toList();
        }

        return items.stream().map(this::toDto).collect(Collectors.toList());
    }

    public List<LostFoundItemDto> searchItems(String query) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        var user = userRepository.findByEmail(email).orElseThrow();
        String campusId = user.getCampus() != null ? user.getCampus().getId() : null;

        List<LostFoundItem> items = lostFoundItemRepository.findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(query, query);

        if (campusId != null) {
            items = items.stream().filter(item -> item.getCampus() != null && campusId.equals(item.getCampus().getId())).toList();
        }

        return items.stream().map(this::toDto).collect(Collectors.toList());
    }

    public LostFoundItemDto getItemById(String id) {
        LostFoundItem item = lostFoundItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        return toDto(item);
    }

    public LostFoundItemDto createItem(CreateLostFoundItemRequest request) {
        User currentUser = getCurrentUser();
        LostFoundItem.Type type = LostFoundItem.Type.valueOf(request.getType().toUpperCase());
        Campus campus = currentUser.getCampus();

        LostFoundItem item = LostFoundItem.builder()
                .title(request.getTitle())
                .category(request.getCategory())
                .location(request.getLocation())
                .date(request.getDate())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .type(type)
                .status(LostFoundItem.Status.OPEN)
                .contact(request.getContact())
                .reportedBy(currentUser)
                .campus(campus)
                .build();

        lostFoundItemRepository.save(item);
        return toDto(item);
    }

    public LostFoundItemDto updateItem(String id, UpdateLostFoundItemRequest request) {
        LostFoundItem item = lostFoundItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (request.getTitle() != null) item.setTitle(request.getTitle());
        if (request.getCategory() != null) item.setCategory(request.getCategory());
        if (request.getLocation() != null) item.setLocation(request.getLocation());
        if (request.getDate() != null) item.setDate(request.getDate());
        if (request.getDescription() != null) item.setDescription(request.getDescription());
        if (request.getImageUrl() != null) item.setImageUrl(request.getImageUrl());
        if (request.getContact() != null) item.setContact(request.getContact());
        if (request.getStatus() != null) item.setStatus(LostFoundItem.Status.valueOf(request.getStatus()));

        lostFoundItemRepository.save(item);
        return toDto(item);
    }

    public void deleteItem(String id) {
        if (!lostFoundItemRepository.existsById(id)) {
            throw new RuntimeException("Item not found");
        }
        lostFoundItemRepository.deleteById(id);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private LostFoundItemDto toDto(LostFoundItem item) {
        return LostFoundItemDto.builder()
                .id(item.getId())
                .title(item.getTitle())
                .category(item.getCategory())
                .location(item.getLocation())
                .date(item.getDate())
                .description(item.getDescription())
                .imageUrl(item.getImageUrl())
                .type(item.getType().name())
                .status(item.getStatus().name())
                .contact(item.getContact())
                .reportedByName(item.getReportedBy() != null ? item.getReportedBy().getName() : "Unknown")
                .reportedById(item.getReportedBy() != null ? item.getReportedBy().getId() : null)
                .createdAt(item.getCreatedAt())
                .build();
    }
}

