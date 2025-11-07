package com.example.backend.entity;

import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Team entity representing event teams in the Festify system.
 * Maps to the 'teams' table in Supabase.
 */
@Entity
@Table(name = "teams")
public class Team {
    
    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_leader_id")
    private Profile teamLeader;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id", nullable = false)
    private Registration registration;

    @Column(name = "team_name", nullable = false)
    private String teamName;

    @Column(name = "team_leader_name", nullable = false)
    private String teamLeaderName;

    @Column(name = "team_leader_phone")
    private String teamLeaderPhone;

    @Column(name = "team_leader_email")
    private String teamLeaderEmail;

    @Column(name = "team_leader_university_reg")
    private String teamLeaderUniversityReg;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    // Constructors
    public Team() {}

    public Team(UUID id, Event event, Profile teamLeader, Registration registration,
               String teamName, String teamLeaderName, String teamLeaderPhone,
               String teamLeaderEmail, String teamLeaderUniversityReg,
               OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.event = event;
        this.teamLeader = teamLeader;
        this.registration = registration;
        this.teamName = teamName;
        this.teamLeaderName = teamLeaderName;
        this.teamLeaderPhone = teamLeaderPhone;
        this.teamLeaderEmail = teamLeaderEmail;
        this.teamLeaderUniversityReg = teamLeaderUniversityReg;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
        if (this.createdAt == null) {
            this.createdAt = OffsetDateTime.now();
        }
        if (this.updatedAt == null) {
            this.updatedAt = this.createdAt;
        }
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public Profile getTeamLeader() {
        return teamLeader;
    }

    public void setTeamLeader(Profile teamLeader) {
        this.teamLeader = teamLeader;
    }

    public Registration getRegistration() {
        return registration;
    }

    public void setRegistration(Registration registration) {
        this.registration = registration;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public String getTeamLeaderName() {
        return teamLeaderName;
    }

    public void setTeamLeaderName(String teamLeaderName) {
        this.teamLeaderName = teamLeaderName;
    }

    public String getTeamLeaderPhone() {
        return teamLeaderPhone;
    }

    public void setTeamLeaderPhone(String teamLeaderPhone) {
        this.teamLeaderPhone = teamLeaderPhone;
    }

    public String getTeamLeaderEmail() {
        return teamLeaderEmail;
    }

    public void setTeamLeaderEmail(String teamLeaderEmail) {
        this.teamLeaderEmail = teamLeaderEmail;
    }

    public String getTeamLeaderUniversityReg() {
        return teamLeaderUniversityReg;
    }

    public void setTeamLeaderUniversityReg(String teamLeaderUniversityReg) {
        this.teamLeaderUniversityReg = teamLeaderUniversityReg;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
