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
    
    @Column(name = "member_name", nullable = false)
    private String memberName;

    @Column(name = "member_email")
    private String memberEmail;

    @Column(name = "member_phone")
    private String memberPhone;

    @Column(name = "university_registration_number")
    private String universityRegistrationNumber;

    @Column(name = "is_leader", nullable = false)
    private Boolean leader;

    @Column(name = "joined_at", nullable = false)
    private OffsetDateTime joinedAt;

    // Constructors
    public TeamMember() {}

    public TeamMember(UUID id, Team team, String memberName, String memberEmail,
                     String memberPhone, String universityRegistrationNumber,
                     Boolean leader, OffsetDateTime joinedAt) {
        this.id = id;
        this.team = team;
        this.memberName = memberName;
        this.memberEmail = memberEmail;
        this.memberPhone = memberPhone;
        this.universityRegistrationNumber = universityRegistrationNumber;
        this.leader = leader;
        this.joinedAt = joinedAt;
    }

    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
        if (this.joinedAt == null) {
            this.joinedAt = OffsetDateTime.now();
        }
        if (this.leader == null) {
            this.leader = Boolean.FALSE;
        }
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

    public OffsetDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(OffsetDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }

    public String getMemberName() {
        return memberName;
    }

    public void setMemberName(String memberName) {
        this.memberName = memberName;
    }

    public String getMemberEmail() {
        return memberEmail;
    }

    public void setMemberEmail(String memberEmail) {
        this.memberEmail = memberEmail;
    }

    public String getMemberPhone() {
        return memberPhone;
    }

    public void setMemberPhone(String memberPhone) {
        this.memberPhone = memberPhone;
    }

    public String getUniversityRegistrationNumber() {
        return universityRegistrationNumber;
    }

    public void setUniversityRegistrationNumber(String universityRegistrationNumber) {
        this.universityRegistrationNumber = universityRegistrationNumber;
    }

    public Boolean getLeader() {
        return leader;
    }

    public void setLeader(Boolean leader) {
        this.leader = leader;
    }
}
