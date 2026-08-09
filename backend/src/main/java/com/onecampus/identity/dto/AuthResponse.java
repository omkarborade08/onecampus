package com.onecampus.identity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String refreshToken;
    private String id;
    private String email;
    private String mobile;
    private String name;

    private String campusId;
    private String campusName;
    private String role;
}

