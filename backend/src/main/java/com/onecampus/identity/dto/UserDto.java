package com.onecampus.identity.dto;

import com.onecampus.identity.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private String id;
    private String name;
    private String email;
    private String mobile;

    private String role;
    private String campusName;

    public static UserDto from(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .mobile(user.getMobile())

                .role(user.getRole().name())
                .campusName(user.getCampus() != null ? user.getCampus().getName() : null)
                .build();
    }
}

