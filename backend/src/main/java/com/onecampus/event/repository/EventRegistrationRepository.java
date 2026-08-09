package com.onecampus.event.repository;

import com.onecampus.event.entity.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, String> {
    boolean existsByEventIdAndUserId(String eventId, String userId);
    List<EventRegistration> findByEventIdOrderByCreatedAtAsc(String eventId);
}