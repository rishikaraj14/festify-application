package com.example.backend.entity;

import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * TeamMember entity representing team members in the Festify system.
 * Maps to the 'team_members' table in Supabase.
 */
@Entity
@Table(name = "team_members")
public class TeamMember {
    
    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Profile member;
    
    @Column(name = "joined_at", nullable = false)
    private OffsetDateTime joinedAt;

    // Constructors
    public TeamMember() {}

    public TeamMember(UUID id, Team team, Profile member, OffsetDateTime joinedAt) {
        this.id = id;
        this.team = team;
        this.member = member;
        this.joinedAt = joinedAt;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public Profile getMember() {
        return member;
    }

    public void setMember(Profile member) {
        this.member = member;
    }

    public OffsetDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(OffsetDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
}
