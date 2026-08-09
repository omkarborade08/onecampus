package com.onecampus.identity.service;

import com.onecampus.common.security.JwtService;
import com.onecampus.identity.dto.AuthResponse;
import com.onecampus.identity.dto.LoginRequest;
import com.onecampus.identity.dto.RegisterRequest;
import com.onecampus.identity.dto.UpdateProfileRequest;
import com.onecampus.identity.dto.UserDto;
import com.onecampus.identity.entity.Campus;
import com.onecampus.identity.entity.RefreshToken;
import com.onecampus.identity.entity.User;
import com.onecampus.identity.repository.CampusRepository;
import com.onecampus.identity.repository.RefreshTokenRepository;
import com.onecampus.identity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class IdentityService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CampusRepository campusRepository;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        Campus campus = null;
        if (request.getCampusId() != null && !request.getCampusId().isEmpty()) {
            campus = campusRepository.findById(request.getCampusId()).orElse(null);
        } else if (request.getNewCampusName() != null && !request.getNewCampusName().isEmpty()) {
            campus = Campus.builder()
                    .name(request.getNewCampusName())
                    .location(request.getNewCampusLocation() != null ? request.getNewCampusLocation() : "")
                    .build();
            campus = campusRepository.save(campus);
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))

                .mobile(request.getMobile())
                .campus(campus)
                .role(User.Role.STUDENT)
                .build();

        userRepository.saveAndFlush(user);

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        saveRefreshToken(user, refreshToken);

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .id(user.getId())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .name(user.getName())

                .campusId(user.getCampus() != null ? user.getCampus().getId() : null)
                .campusName(user.getCampus() != null ? user.getCampus().getName() : null)
                .role(user.getRole().name())
                .build();
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        saveRefreshToken(user, refreshToken);

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .id(user.getId())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .name(user.getName())

                .campusId(user.getCampus() != null ? user.getCampus().getId() : null)
                .campusName(user.getCampus() != null ? user.getCampus().getName() : null)
                .role(user.getRole().name())
                .build();
    }

    @Transactional
    public AuthResponse refreshToken(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new RuntimeException("Refresh token is required");
        }

        RefreshToken stored = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (stored.getExpiresAt().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(stored);
            throw new RuntimeException("Refresh token expired");
        }

        String email = jwtService.extractEmail(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String newAccessToken = jwtService.generateToken(user.getEmail(), user.getRole().name());
        String newRefreshToken = jwtService.generateRefreshToken(user.getEmail());

        refreshTokenRepository.delete(stored);
        saveRefreshToken(user, newRefreshToken);

        return AuthResponse.builder()
                .token(newAccessToken)
                .refreshToken(newRefreshToken)
                .id(user.getId())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .name(user.getName())

                .campusId(user.getCampus() != null ? user.getCampus().getId() : null)
                .campusName(user.getCampus() != null ? user.getCampus().getName() : null)
                .role(user.getRole().name())
                .build();
    }

    public void logout(String userId) {
        refreshTokenRepository.deleteByUser_Id(userId);
    }

    private void saveRefreshToken(User user, String refreshToken) {
        RefreshToken token = RefreshToken.builder()
                .token(refreshToken)
                .user(user)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();
        refreshTokenRepository.save(token);
    }

    @Transactional(readOnly = true)
    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserDto.from(user);
    }

    @Transactional
    public AuthResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        String updatedEmail = request.getEmail().trim();
        if (!updatedEmail.equalsIgnoreCase(user.getEmail())
                && userRepository.existsByEmailAndIdNot(updatedEmail, user.getId())) {
            throw new RuntimeException("Email is already registered");
        }
        user.setEmail(updatedEmail);
        user.setName(request.getName().trim());

        user.setMobile(request.getMobile() == null ? null : request.getMobile().trim());
        userRepository.saveAndFlush(user);
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());
        saveRefreshToken(user, refreshToken);
        return AuthResponse.builder()
            .token(token)
            .refreshToken(refreshToken)
            .id(user.getId())
            .email(user.getEmail())
            .mobile(user.getMobile())
            .name(user.getName())

            .campusId(user.getCampus() != null ? user.getCampus().getId() : null)
            .campusName(user.getCampus() != null ? user.getCampus().getName() : null)
            .role(user.getRole().name())
            .build();
    }

}

