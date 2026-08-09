package com.onecampus.event.service;

import com.onecampus.event.dto.CreateEventRequest;
import com.onecampus.event.dto.EventDto;
import com.onecampus.event.dto.EventRegistrantDto;
import com.onecampus.event.entity.Event;
import com.onecampus.event.entity.EventRegistration;
import com.onecampus.event.repository.EventRepository;
import com.onecampus.event.repository.EventRegistrationRepository;
import com.onecampus.identity.entity.Campus;
import com.onecampus.identity.repository.CampusRepository;
import com.onecampus.identity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final CampusRepository campusRepository;
    private final EventRegistrationRepository eventRegistrationRepository;

    public List<EventDto> getAllEvents(String category) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        var user = userRepository.findByEmail(email).orElseThrow();
        String campusId = user.getCampus() != null ? user.getCampus().getId() : null;

        List<Event> events;
        if (category != null && !category.isEmpty() && !"all".equalsIgnoreCase(category)) {
            events = eventRepository.findByCategory(category);
        } else {
            events = eventRepository.findAll();
        }

        if (campusId != null) {
            events = events.stream().filter(e -> e.getCampus() != null && campusId.equals(e.getCampus().getId())).toList();
        }

        return events.stream().map(event -> toDto(event, user.getId())).collect(Collectors.toList());
    }

    public List<EventDto> searchEvents(String query) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        var user = userRepository.findByEmail(email).orElseThrow();
        String campusId = user.getCampus() != null ? user.getCampus().getId() : null;

        List<Event> events = eventRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);

        if (campusId != null) {
            events = events.stream().filter(e -> e.getCampus() != null && campusId.equals(e.getCampus().getId())).toList();
        }

        return events.stream().map(event -> toDto(event, user.getId())).collect(Collectors.toList());
    }

    public EventDto getEventById(String id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        var user = userRepository.findByEmail(email).orElseThrow();
        return toDto(event, user.getId());
    }

    public EventDto createEvent(CreateEventRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        var user = userRepository.findByEmail(email).orElseThrow();
        Campus campus = user.getCampus();

        Event event = Event.builder()
                .title(request.getTitle())
                .date(request.getDate())
                .time(request.getTime())
                .location(request.getLocation())
                .description(request.getDescription())
                .organizer(request.getOrganizer())
                .imageUrl(request.getImageUrl())
                .category(request.getCategory())
                .attendees(0)
                .campus(campus)
                .creator(user)
                .build();

        eventRepository.save(event);
        return toDto(event, user.getId());
    }

    public EventDto registerForEvent(String eventId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        var user = userRepository.findByEmail(email).orElseThrow();
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        boolean isCreator = event.getCreator() != null && user.getId().equals(event.getCreator().getId())
            || user.getName().equalsIgnoreCase(event.getOrganizer());
        if (isCreator) {
            throw new RuntimeException("Event creators do not need to register");
        }

        if (!eventRegistrationRepository.existsByEventIdAndUserId(eventId, user.getId())) {
            eventRegistrationRepository.save(EventRegistration.builder().event(event).user(user).build());
            event.setAttendees(event.getAttendees() + 1);
            eventRepository.save(event);
        }

        return toDto(event, user.getId());
    }

        public List<EventRegistrantDto> getRegistrants(String eventId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        var user = userRepository.findByEmail(email).orElseThrow();
        Event event = eventRepository.findById(eventId)
            .orElseThrow(() -> new RuntimeException("Event not found"));

        boolean isCreator = event.getCreator() != null && user.getId().equals(event.getCreator().getId())
            || user.getName().equalsIgnoreCase(event.getOrganizer());
        if (!isCreator) {
            throw new RuntimeException("Only the event creator can view registrants");
        }

        return eventRegistrationRepository.findByEventIdOrderByCreatedAtAsc(eventId).stream()
            .map(registration -> EventRegistrantDto.builder()
                .id(registration.getUser().getId())
                .name(registration.getUser().getName())
                .email(registration.getUser().getEmail())
                .build())
            .toList();
        }

    private EventDto toDto(Event event, String userId) {
        return EventDto.builder()
                .id(event.getId())
                .title(event.getTitle())
                .date(event.getDate())
                .time(event.getTime())
                .location(event.getLocation())
                .description(event.getDescription())
                .organizer(event.getOrganizer())
                .attendees(event.getAttendees())
                .imageUrl(event.getImageUrl())
                .category(event.getCategory())
                .createdAt(event.getCreatedAt())
                .creatorId(event.getCreator() != null ? event.getCreator().getId() : null)
                .registered(eventRegistrationRepository.existsByEventIdAndUserId(event.getId(), userId))
                .build();
    }
}

