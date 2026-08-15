package com.onecampus.common.security;

import com.onecampus.identity.entity.User;
import com.onecampus.identity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    @Bean
    public JwtAuthFilter jwtAuthFilter(
            JwtService jwtService,
            UserRepository userRepository) {

        return new JwtAuthFilter(jwtService, userRepository);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthFilter jwtAuthFilter) throws Exception {

        http
            // Global CORS
            .cors(cors ->
                cors.configurationSource(corsConfigurationSource())
            )

            // Disable CSRF for REST API
            .csrf(csrf -> csrf.disable())

            // JWT-based stateless authentication
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .authorizeHttpRequests(auth -> auth

                // =========================
                // PUBLIC AUTHENTICATION
                // =========================
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()

                // =========================
                // PUBLIC APIs
                // =========================
                .requestMatchers("/api/campuses/**").permitAll()
                .requestMatchers("/api/marketplace/**").permitAll()
                .requestMatchers("/api/lost-found/**").permitAll()
                .requestMatchers("/api/events/**").permitAll()
                .requestMatchers("/api/chat/**").permitAll()

                // =========================
                // WEBSOCKET
                // =========================
                .requestMatchers("/ws/**").permitAll()
                .requestMatchers("/topic/**").permitAll()
                .requestMatchers("/queue/**").permitAll()
                .requestMatchers("/app/**").permitAll()

                // =========================
                // EVERYTHING ELSE
                // =========================
                .anyRequest().authenticated()
            )

            // JWT filter
            .addFilterBefore(
                jwtAuthFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider();

        provider.setUserDetailsService(
            (UserDetailsService) email -> {

                User user = userRepository.findByEmail(email)
                        .orElseThrow(() ->
                            new UsernameNotFoundException(
                                "User not found"
                            )
                        );

                return new CustomUserDetails(user);
            }
        );

        provider.setPasswordEncoder(passwordEncoder);

        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {

        return config.getAuthenticationManager();
    }

    // ==========================================
    // GLOBAL CORS CONFIGURATION
    // ==========================================
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:3000"

                // ADD YOUR VERCEL URL HERE
                // Example:
                // "https://onecampus.vercel.app"
        ));

        configuration.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
        ));

        configuration.setAllowedHeaders(List.of("*"));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        // Apply CORS to ALL endpoints
        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}