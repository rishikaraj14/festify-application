package com.example.backend.entity;

import com.example.backend.entity.enums.EventStatus;
import com.example.backend.entity.enums.ParticipationType;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Event entity representing events in the Festify system.
 * Maps to the 'events' table in Supabase.
 */
@Entity
@Table(name = "events")
public class Event {
    
    @Id
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "college_id", nullable = false)
    private College college;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_id", nullable = false)
    private Profile organizer;
    
    @Column(name = "start_date", nullable = false)
    private OffsetDateTime startDate;
    
    @Column(name = "end_date", nullable = false)
    private OffsetDateTime endDate;

    @Column(name = "location", nullable = false)
    private String location;

    @Column(name = "venue_details")
    private String venueDetails;

    @Enumerated(EnumType.STRING)
    @Column(name = "participation_type", nullable = false)
    private ParticipationType participationType;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_status", nullable = false)
    private EventStatus eventStatus;

    @Column(name = "team_size_min", nullable = false)
    private Integer teamSizeMin;

    @Column(name = "team_size_max", nullable = false)
    private Integer teamSizeMax;

    @Column(name = "max_attendees")
    private Integer maxAttendees;

    @Column(name = "current_attendees", nullable = false)
    private Integer currentAttendees;

    @Column(name = "registration_deadline")
    private OffsetDateTime registrationDeadline;

    @Column(name = "is_featured", nullable = false)
    private Boolean featured;

    @Column(name = "is_global", nullable = false)
    private Boolean global;

    @Column(name = "individual_price", precision = 10, scale = 2)
    private BigDecimal individualPrice;

    @Column(name = "team_base_price", precision = 10, scale = 2)
    private BigDecimal teamBasePrice;

    @Column(name = "price_per_member", precision = 10, scale = 2)
    private BigDecimal pricePerMember;

    @Column(name = "has_custom_team_pricing", nullable = false)
    private Boolean hasCustomTeamPricing;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    // Constructors
    public Event() {}

    public Event(UUID id, String title, String description, String imageUrl, Category category,
                 College college, Profile organizer, OffsetDateTime startDate, OffsetDateTime endDate,
                 String location, String venueDetails, ParticipationType participationType,
                 EventStatus eventStatus, Integer teamSizeMin, Integer teamSizeMax,
                 Integer maxAttendees, Integer currentAttendees, OffsetDateTime registrationDeadline,
                 Boolean featured, Boolean global, BigDecimal individualPrice, BigDecimal teamBasePrice,
                 BigDecimal pricePerMember, Boolean hasCustomTeamPricing,
                 OffsetDateTime createdAt, OffsetDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.category = category;
        this.college = college;
        this.organizer = organizer;
        this.startDate = startDate;
        this.endDate = endDate;
        this.location = location;
        this.venueDetails = venueDetails;
        this.participationType = participationType;
        this.eventStatus = eventStatus;
        this.teamSizeMin = teamSizeMin;
        this.teamSizeMax = teamSizeMax;
        this.maxAttendees = maxAttendees;
        this.currentAttendees = currentAttendees;
        this.registrationDeadline = registrationDeadline;
        this.featured = featured;
        this.global = global;
        this.individualPrice = individualPrice;
        this.teamBasePrice = teamBasePrice;
        this.pricePerMember = pricePerMember;
        this.hasCustomTeamPricing = hasCustomTeamPricing;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    public void applyDefaults() {
        if (this.id == null) {
            this.id = UUID.randomUUID();
        }
        if (this.teamSizeMin == null) {
            this.teamSizeMin = 1;
        }
        if (this.teamSizeMax == null) {
            this.teamSizeMax = 1;
        }
        if (this.currentAttendees == null) {
            this.currentAttendees = 0;
        }
        if (this.featured == null) {
            this.featured = Boolean.FALSE;
        }
        if (this.global == null) {
            this.global = Boolean.FALSE;
        }
        if (this.individualPrice == null) {
            this.individualPrice = BigDecimal.ZERO;
        }
        if (this.teamBasePrice == null) {
            this.teamBasePrice = BigDecimal.ZERO;
        }
        if (this.pricePerMember == null) {
            this.pricePerMember = BigDecimal.ZERO;
        }
        if (this.hasCustomTeamPricing == null) {
            this.hasCustomTeamPricing = Boolean.FALSE;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public College getCollege() {
        return college;
    }

    public void setCollege(College college) {
        this.college = college;
    }

    public Profile getOrganizer() {
        return organizer;
    }

    public void setOrganizer(Profile organizer) {
        this.organizer = organizer;
    }

    public OffsetDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(OffsetDateTime startDate) {
        this.startDate = startDate;
    }

    public OffsetDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(OffsetDateTime endDate) {
        this.endDate = endDate;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getVenueDetails() {
        return venueDetails;
    }

    public void setVenueDetails(String venueDetails) {
        this.venueDetails = venueDetails;
    }

    public ParticipationType getParticipationType() {
        return participationType;
    }

    public void setParticipationType(ParticipationType participationType) {
        this.participationType = participationType;
    }

    public EventStatus getEventStatus() {
        return eventStatus;
    }

    public void setEventStatus(EventStatus eventStatus) {
        this.eventStatus = eventStatus;
    }

    public Integer getTeamSizeMin() {
        return teamSizeMin;
    }

    public void setTeamSizeMin(Integer teamSizeMin) {
        this.teamSizeMin = teamSizeMin;
    }

    public Integer getTeamSizeMax() {
        return teamSizeMax;
    }

    public void setTeamSizeMax(Integer teamSizeMax) {
        this.teamSizeMax = teamSizeMax;
    }

    public Integer getMaxAttendees() {
        return maxAttendees;
    }

    public void setMaxAttendees(Integer maxAttendees) {
        this.maxAttendees = maxAttendees;
    }

    public Integer getCurrentAttendees() {
        return currentAttendees;
    }

    public void setCurrentAttendees(Integer currentAttendees) {
        this.currentAttendees = currentAttendees;
    }

    public OffsetDateTime getRegistrationDeadline() {
        return registrationDeadline;
    }

    public void setRegistrationDeadline(OffsetDateTime registrationDeadline) {
        this.registrationDeadline = registrationDeadline;
    }

    public Boolean getFeatured() {
        return featured;
    }

    public void setFeatured(Boolean featured) {
        this.featured = featured;
    }

    public Boolean getGlobal() {
        return global;
    }

    public void setGlobal(Boolean global) {
        this.global = global;
    }

    public BigDecimal getIndividualPrice() {
        return individualPrice;
    }

    public void setIndividualPrice(BigDecimal individualPrice) {
        this.individualPrice = individualPrice;
    }

    public BigDecimal getTeamBasePrice() {
        return teamBasePrice;
    }

    public void setTeamBasePrice(BigDecimal teamBasePrice) {
        this.teamBasePrice = teamBasePrice;
    }

    public BigDecimal getPricePerMember() {
        return pricePerMember;
    }

    public void setPricePerMember(BigDecimal pricePerMember) {
        this.pricePerMember = pricePerMember;
    }

    public Boolean getHasCustomTeamPricing() {
        return hasCustomTeamPricing;
    }

    public void setHasCustomTeamPricing(Boolean hasCustomTeamPricing) {
        this.hasCustomTeamPricing = hasCustomTeamPricing;
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
