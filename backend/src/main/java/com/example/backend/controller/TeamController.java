package com.example.backend.controller;

import com.example.backend.entity.Team;
import com.example.backend.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * REST Controller for Team entity.
 * Handles CRUD operations for event teams.
 */
@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "http://localhost:3000")
@SuppressWarnings("null")
public class TeamController {

    @Autowired
    private TeamRepository teamRepository;

    /**
     * Get all teams.
     */
    @GetMapping
    public ResponseEntity<List<Team>> getAllTeams() {
        List<Team> teams = teamRepository.findAll();
        return ResponseEntity.ok(teams);
    }

    /**
     * Get team by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Team> getTeamById(@PathVariable UUID id) {
        return teamRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create a new team.
     */
    @PostMapping
    public ResponseEntity<Team> createTeam(@RequestBody Team team) {
        team.setCreatedAt(OffsetDateTime.now());
        Team savedTeam = teamRepository.save(team);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTeam);
    }

    /**
     * Update an existing team.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Team> updateTeam(
            @PathVariable UUID id,
            @RequestBody Team teamDetails) {
        
        return teamRepository.findById(id)
                .map(team -> {
                    team.setEvent(teamDetails.getEvent());
                    team.setLeader(teamDetails.getLeader());
                    team.setRegistration(teamDetails.getRegistration());
                    team.setName(teamDetails.getName());
                    
                    Team updatedTeam = teamRepository.save(team);
                    return ResponseEntity.ok(updatedTeam);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a team.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable UUID id) {
        if (teamRepository.existsById(id)) {
            teamRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Get teams by event ID.
     */
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Team>> getTeamsByEvent(@PathVariable UUID eventId) {
        List<Team> teams = teamRepository.findByEventId(eventId);
        return ResponseEntity.ok(teams);
    }

    /**
     * Get teams by leader ID.
     */
    @GetMapping("/leader/{leaderId}")
    public ResponseEntity<List<Team>> getTeamsByLeader(@PathVariable UUID leaderId) {
        List<Team> teams = teamRepository.findByLeaderId(leaderId);
        return ResponseEntity.ok(teams);
    }
}
