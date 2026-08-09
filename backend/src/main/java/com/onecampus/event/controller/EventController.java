package com.onecampus.event.controller;

import com.onecampus.event.dto.CreateEventRequest;
import com.onecampus.event.dto.EventDto;
import com.onecampus.event.dto.EventRegistrantDto;
import com.onecampus.event.service.EventService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public ResponseEntity<List<EventDto>> getAllEvents(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(eventService.getAllEvents(category));
    }

    @GetMapping("/search")
    public ResponseEntity<List<EventDto>> searchEvents(@RequestParam String query) {
        return ResponseEntity.ok(eventService.searchEvents(query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDto> getEvent(@PathVariable String id) {
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @PostMapping
    public ResponseEntity<EventDto> createEvent(@Valid @RequestBody CreateEventRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.createEvent(request));
    }

    @PostMapping("/{id}/register")
    public ResponseEntity<EventDto> registerForEvent(@PathVariable String id) {
        return ResponseEntity.ok(eventService.registerForEvent(id));
    }

    @GetMapping("/{id}/registrants")
    public ResponseEntity<List<EventRegistrantDto>> getRegistrants(@PathVariable String id) {
        return ResponseEntity.ok(eventService.getRegistrants(id));
    }
}

