package com.onecampus.common.controller;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {
    private final RestClient restClient;
    @Value("${chatbot.endpoint:}")
    private String endpoint;
    @Value("${chatbot.api-key:}")
    private String apiKey;
    @Value("${chatbot.model:}")
    private String model;

    public ChatbotController(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder.build();
    }

    @PostMapping("/message")
    public ResponseEntity<?> send(@RequestBody Map<String, String> request) {
        if (endpoint.isBlank() || apiKey.isBlank() || model.isBlank()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                "message", "Chatbot is not configured. Set CHATBOT_ENDPOINT, CHATBOT_API_KEY, and CHATBOT_MODEL on the backend."
            ));
        }

        Map<String, Object> body = Map.of(
            "model", model,
            "messages", new Object[] { Map.of("role", "user", "content", request.getOrDefault("message", "")) }
        );
        JsonNode response = restClient.post()
            .uri(endpoint)
            .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
            .contentType(MediaType.APPLICATION_JSON)
            .body(body)
            .retrieve()
            .body(JsonNode.class);

        String reply = response != null && response.has("choices")
            ? response.at("/choices/0/message/content").asText()
            : response != null ? response.path("reply").asText(response.path("message").asText()) : "";
        return ResponseEntity.ok(Map.of("reply", reply));
    }
}