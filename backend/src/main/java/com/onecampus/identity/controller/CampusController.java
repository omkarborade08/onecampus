package com.onecampus.identity.controller;

import com.onecampus.identity.entity.Campus;
import com.onecampus.identity.repository.CampusRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/campuses")
public class CampusController {

    private final CampusRepository campusRepository;

    public CampusController(CampusRepository campusRepository) {
        this.campusRepository = campusRepository;
    }

    @GetMapping
    public ResponseEntity<List<Campus>> getAllCampuses() {
        return ResponseEntity.ok(campusRepository.findAll());
    }
}

