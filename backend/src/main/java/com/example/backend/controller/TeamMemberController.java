package com.example.backend.controller;

import com.example.backend.entity.TeamMember;
import com.example.backend.repository.TeamMemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * REST Controller for TeamMember entity.
 * Handles CRUD operations for team members.
 */
@RestController
@RequestMapping("/api/team-members")
@CrossOrigin(origins = "http://localhost:3000")
@SuppressWarnings("null")
public class TeamMemberController {

    @Autowired
    private TeamMemberRepository teamMemberRepository;

    /**
     * Get all team members.
     */
    @GetMapping
    public ResponseEntity<List<TeamMember>> getAllTeamMembers() {
        List<TeamMember> teamMembers = teamMemberRepository.findAll();
        return ResponseEntity.ok(teamMembers);
    }

    /**
     * Get team member by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TeamMember> getTeamMemberById(@PathVariable UUID id) {
        return teamMemberRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create a new team member.
     */
    @PostMapping
    public ResponseEntity<TeamMember> createTeamMember(@RequestBody TeamMember teamMember) {
        teamMember.setJoinedAt(OffsetDateTime.now());
        TeamMember savedTeamMember = teamMemberRepository.save(teamMember);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTeamMember);
    }

    /**
     * Update an existing team member.
     */
    @PutMapping("/{id}")
    public ResponseEntity<TeamMember> updateTeamMember(
            @PathVariable UUID id,
            @RequestBody TeamMember teamMemberDetails) {
        
        return teamMemberRepository.findById(id)
                .map(teamMember -> {
                    teamMember.setTeam(teamMemberDetails.getTeam());
                    teamMember.setMember(teamMemberDetails.getMember());
                    
                    TeamMember updatedTeamMember = teamMemberRepository.save(teamMember);
                    return ResponseEntity.ok(updatedTeamMember);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a team member.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeamMember(@PathVariable UUID id) {
        if (teamMemberRepository.existsById(id)) {
            teamMemberRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Get members by team ID.
     */
    @GetMapping("/team/{teamId}")
    public ResponseEntity<List<TeamMember>> getMembersByTeam(@PathVariable UUID teamId) {
        List<TeamMember> teamMembers = teamMemberRepository.findByTeamId(teamId);
        return ResponseEntity.ok(teamMembers);
    }

    /**
     * Get teams by member ID.
     */
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<TeamMember>> getTeamsByMember(@PathVariable UUID memberId) {
        List<TeamMember> teamMembers = teamMemberRepository.findByMemberId(memberId);
        return ResponseEntity.ok(teamMembers);
    }
}
