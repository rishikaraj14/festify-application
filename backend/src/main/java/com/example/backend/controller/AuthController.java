package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Authentication test controller to verify JWT authentication is working.
 * Provides endpoints to check authentication status and user info.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    /**
     * Get information about the currently authenticated user.
     * Useful for testing if JWT authentication is working.
     * 
     * @param authentication The authenticated user (injected by Spring Security)
     * @return User information including email, ID, and roles
     */
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(Authentication authentication) {
        Map<String, Object> userInfo = new HashMap<>();
        
        // Get email (username in our case)
        userInfo.put("email", authentication.getName());
        
        // Get user ID from details
        userInfo.put("userId", authentication.getDetails());
        
        // Get roles/authorities
        userInfo.put("roles", authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));
        
        // Check if authenticated
        userInfo.put("authenticated", authentication.isAuthenticated());
        
        return ResponseEntity.ok(userInfo);
    }

    /**
     * Simple health check endpoint that requires authentication.
     * Use this to test if your JWT token is valid.
     * 
     * @return Success message with authenticated user's email
     */
    @GetMapping("/check")
    public ResponseEntity<Map<String, String>> checkAuth(Authentication authentication) {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Authentication successful");
        response.put("user", authentication.getName());
        
        return ResponseEntity.ok(response);
    }
}
