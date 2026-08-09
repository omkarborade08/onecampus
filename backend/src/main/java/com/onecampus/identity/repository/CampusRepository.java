package com.onecampus.identity.repository;

import com.onecampus.identity.entity.Campus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CampusRepository extends JpaRepository<Campus, String> {
    Optional<Campus> findByName(String name);
}

