package com.onecampus.identity.controller;

import com.onecampus.identity.dto.UpdateProfileRequest;
import com.onecampus.identity.dto.AuthResponse;
import com.onecampus.identity.dto.UserDto;
import com.onecampus.identity.service.IdentityService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final IdentityService identityService;

    public ProfileController(IdentityService identityService) {
        this.identityService = identityService;
    }

    @GetMapping
    public ResponseEntity<UserDto> getProfile() {
        return ResponseEntity.ok(identityService.getCurrentUser(currentEmail()));
    }

    @PutMapping
    public ResponseEntity<AuthResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(identityService.updateProfile(currentEmail(), request));
    }

    private String currentEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}