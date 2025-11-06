package com.example.backend.entity;

import com.example.backend.entity.enums.TicketType;
import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Ticket entity representing event tickets in the Festify system.
 * Maps to the 'tickets' table in Supabase.
 */
@Entity
@Table(name = "tickets")
public class Ticket {
    
    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registration_id", nullable = false)
    private Registration registration;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false)
    private TicketType type;
    
    @Column(name = "qr_code_url")
    private String qrCodeUrl;
    
    @Column(name = "issued_at", nullable = false)
    private OffsetDateTime issuedAt;

    // Constructors
    public Ticket() {}

    public Ticket(UUID id, Registration registration, Event event, TicketType type,
                 String qrCodeUrl, OffsetDateTime issuedAt) {
        this.id = id;
        this.registration = registration;
        this.event = event;
        this.type = type;
        this.qrCodeUrl = qrCodeUrl;
        this.issuedAt = issuedAt;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Registration getRegistration() {
        return registration;
    }

    public void setRegistration(Registration registration) {
        this.registration = registration;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public TicketType getType() {
        return type;
    }

    public void setType(TicketType type) {
        this.type = type;
    }

    public String getQrCodeUrl() {
        return qrCodeUrl;
    }

    public void setQrCodeUrl(String qrCodeUrl) {
        this.qrCodeUrl = qrCodeUrl;
    }

    public OffsetDateTime getIssuedAt() {
        return issuedAt;
    }

    public void setIssuedAt(OffsetDateTime issuedAt) {
        this.issuedAt = issuedAt;
    }
}
