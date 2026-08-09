package com.onecampus.identity.controller;

import com.onecampus.identity.dto.UserDto;
import com.onecampus.identity.service.IdentityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestAuthController {

    private final IdentityService identityService;

    public TestAuthController(IdentityService identityService) {
        this.identityService = identityService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me() {
        return ResponseEntity.ok(identityService.getCurrentUser(
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName()
        ));
    }
}

