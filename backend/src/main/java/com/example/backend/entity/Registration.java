package com.example.backend.entity;

import com.example.backend.entity.enums.PaymentStatus;
import com.example.backend.entity.enums.RegistrationStatus;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Registration entity representing event registrations in the Festify system.
 * Maps to the 'registrations' table in Supabase.
 */
@Entity
@Table(name = "registrations", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"event_id", "user_id"})
})
public class Registration {
    
    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Profile user;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "registration_status", nullable = false)
    private RegistrationStatus registrationStatus;

    @Column(name = "registration_date", nullable = false)
    private OffsetDateTime registrationDate;

    @Column(name = "attended_at")
    private OffsetDateTime attendedAt;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "is_team", nullable = false)
    private Boolean team;

    @Column(name = "team_size")
    private Integer teamSize;

    @Column(name = "team_name")
    private String teamName;

    @Column(name = "team_leader_name")
    private String teamLeaderName;

    @Column(name = "team_leader_phone")
    private String teamLeaderPhone;

    @Column(name = "team_leader_email")
    private String teamLeaderEmail;

    @Column(name = "team_leader_university_reg")
    private String teamLeaderUniversityReg;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false)
    private PaymentStatus paymentStatus;

    @Column(name = "payment_amount", precision = 10, scale = 2)
    private BigDecimal paymentAmount;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "transaction_id")
    private String transactionId;

    @Column(name = "paid_at")
    private OffsetDateTime paidAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    // Constructors
    public Registration() {}

    public Registration(UUID id, Event event, Profile user, RegistrationStatus registrationStatus,
                       OffsetDateTime registrationDate, OffsetDateTime attendedAt, String notes,
                       Boolean team, Integer teamSize, String teamName, String teamLeaderName,
                       String teamLeaderPhone, String teamLeaderEmail, String teamLeaderUniversityReg,
                       PaymentStatus paymentStatus, BigDecimal paymentAmount, String paymentMethod,
                       String transactionId, OffsetDateTime paidAt,
                       OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.event = event;
        this.user = user;
        this.registrationStatus = registrationStatus;
        this.registrationDate = registrationDate;
        this.attendedAt = attendedAt;
        this.notes = notes;
        this.team = team;
        this.teamSize = teamSize;
        this.teamName = teamName;
        this.teamLeaderName = teamLeaderName;
        this.teamLeaderPhone = teamLeaderPhone;
        this.teamLeaderEmail = teamLeaderEmail;
        this.teamLeaderUniversityReg = teamLeaderUniversityReg;
        this.paymentStatus = paymentStatus;
        this.paymentAmount = paymentAmount;
        this.paymentMethod = paymentMethod;
        this.transactionId = transactionId;
        this.paidAt = paidAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    public void prePersist() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
        if (this.registrationDate == null) {
            this.registrationDate = OffsetDateTime.now();
        }
        if (this.team == null) {
            this.team = Boolean.FALSE;
        }
        if (this.paymentStatus == null) {
            this.paymentStatus = PaymentStatus.PENDING;
        }
        if (this.paymentAmount == null) {
            this.paymentAmount = BigDecimal.ZERO;
        }
        if (this.registrationStatus == null) {
            this.registrationStatus = RegistrationStatus.PENDING;
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

    public Profile getUser() {
        return user;
    }

    public void setUser(Profile user) {
        this.user = user;
    }

    public RegistrationStatus getRegistrationStatus() {
        return registrationStatus;
    }

    public void setRegistrationStatus(RegistrationStatus registrationStatus) {
        this.registrationStatus = registrationStatus;
    }

    public OffsetDateTime getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(OffsetDateTime registrationDate) {
        this.registrationDate = registrationDate;
    }

    public OffsetDateTime getAttendedAt() {
        return attendedAt;
    }

    public void setAttendedAt(OffsetDateTime attendedAt) {
        this.attendedAt = attendedAt;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Boolean getTeam() {
        return team;
    }

    public void setTeam(Boolean team) {
        this.team = team;
    }

    public Integer getTeamSize() {
        return teamSize;
    }

    public void setTeamSize(Integer teamSize) {
        this.teamSize = teamSize;
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

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public BigDecimal getPaymentAmount() {
        return paymentAmount;
    }

    public void setPaymentAmount(BigDecimal paymentAmount) {
        this.paymentAmount = paymentAmount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public OffsetDateTime getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(OffsetDateTime paidAt) {
        this.paidAt = paidAt;
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
