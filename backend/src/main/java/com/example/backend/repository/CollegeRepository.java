package com.example.backend.repository;

import com.example.backend.entity.College;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * Spring Data JPA repository for College entity.
 * Provides CRUD operations and custom query methods for colleges.
 */
@Repository
public interface CollegeRepository extends JpaRepository<College, UUID> {
}
