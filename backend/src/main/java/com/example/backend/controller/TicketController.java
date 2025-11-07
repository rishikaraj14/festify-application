package com.example.backend.controller;

import com.example.backend.entity.Ticket;
import com.example.backend.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * REST Controller for Ticket entity.
 * Handles CRUD operations for event tickets.
 */
@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:3000")
@SuppressWarnings("null")
public class TicketController {

    @Autowired
    private TicketRepository ticketRepository;

    /**
     * Get all tickets.
     */
    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        List<Ticket> tickets = ticketRepository.findAll();
        return ResponseEntity.ok(tickets);
    }

    /**
     * Get ticket by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable UUID id) {
        return ticketRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Create a new ticket.
     */
    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody Ticket ticket) {
        if (ticket.getIssuedAt() == null) {
            ticket.setIssuedAt(OffsetDateTime.now());
        }
        Ticket savedTicket = ticketRepository.save(ticket);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTicket);
    }

    /**
     * Update an existing ticket.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Ticket> updateTicket(
            @PathVariable UUID id,
            @RequestBody Ticket ticketDetails) {
        
        return ticketRepository.findById(id)
                .map(ticket -> {
                    ticket.setEvent(ticketDetails.getEvent());
                    ticket.setRegistration(ticketDetails.getRegistration());
                    ticket.setTicketType(ticketDetails.getTicketType());
                    ticket.setPrice(ticketDetails.getPrice());
                    ticket.setTicketCode(ticketDetails.getTicketCode());
                    ticket.setValid(ticketDetails.getValid());
                    ticket.setIssuedAt(ticketDetails.getIssuedAt());
                    ticket.setUsedAt(ticketDetails.getUsedAt());
                    ticket.setUpdatedAt(OffsetDateTime.now());
                    
                    Ticket updatedTicket = ticketRepository.save(ticket);
                    return ResponseEntity.ok(updatedTicket);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Delete a ticket.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable UUID id) {
        if (ticketRepository.existsById(id)) {
            ticketRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Get ticket by registration ID.
     */
    @GetMapping("/registration/{registrationId}")
    public ResponseEntity<Ticket> getTicketByRegistration(@PathVariable UUID registrationId) {
        return ticketRepository.findByRegistrationId(registrationId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Get tickets by event ID.
     */
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<Ticket>> getTicketsByEvent(@PathVariable UUID eventId) {
        List<Ticket> tickets = ticketRepository.findByEventId(eventId);
        return ResponseEntity.ok(tickets);
    }
}
