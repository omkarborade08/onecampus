package com.onecampus.identity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {
    private String name;
    private String email;
    private String mobile;
    private String password;

    private String campusId;
    private String newCampusName;
    private String newCampusLocation;
}

