package com.example.backend.repository;

import com.example.backend.entity.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository interface for TeamMember entity.
 */
@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, UUID> {
    
    /**
     * Find all members of a specific team.
     */
    List<TeamMember> findByTeamId(UUID teamId);
    
}
