package com.example.backend.repository;

import com.example.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * Spring Data JPA repository for Category entity.
 * Provides CRUD operations and custom query methods for event categories.
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
}
