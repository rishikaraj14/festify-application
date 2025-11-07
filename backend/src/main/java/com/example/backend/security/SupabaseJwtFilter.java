package com.example.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.List;

/**
 * JWT Authentication Filter for Supabase tokens.
 * Validates JWT tokens from the Authorization header and sets authentication context.
 */
@Component
@SuppressWarnings("null")
public class SupabaseJwtFilter extends OncePerRequestFilter {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Override
    @SuppressWarnings("null")
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        
        // Skip JWT validation for public endpoints
        String requestPath = request.getRequestURI();
        String method = request.getMethod();
        
        if (isPublicEndpoint(requestPath, method)) {
            filterChain.doFilter(request, response);
            return;
        }
        
        String authHeader = request.getHeader("Authorization");

        // Skip if no Authorization header or doesn't start with "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            // Extract token from "Bearer <token>"
            String token = authHeader.substring(7);

            // Parse and validate the JWT token
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
            
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // Extract user information from claims
            String email = claims.get("email", String.class);
            String sub = claims.getSubject(); // User ID from Supabase
            
            // Use email as username, fallback to sub if email is not present
            String username = (email != null && !email.isEmpty()) ? email : sub;

            // Extract role from claims (Supabase typically includes role in JWT)
            String role = claims.get("role", String.class);
            List<SimpleGrantedAuthority> authorities = Collections.emptyList();
            
            if (role != null && !role.isEmpty()) {
                authorities = Collections.singletonList(
                    new SimpleGrantedAuthority("ROLE_" + role.toUpperCase())
                );
            }

            // Create authentication object and set in security context
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(username, null, authorities);
            
            // Add additional details (e.g., user ID)
            authentication.setDetails(sub);
            
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Continue with the filter chain
            filterChain.doFilter(request, response);

        } catch (ExpiredJwtException e) {
            // Token has expired
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Token has expired\"}");
            
        } catch (MalformedJwtException e) {
            // Invalid token format
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Invalid token format\"}");
            
        } catch (SignatureException e) {
            // Invalid signature
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Invalid token signature\"}");
            
        } catch (UnsupportedJwtException | IllegalArgumentException e) {
            // Unsupported JWT token or empty/null token
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Invalid or missing token\"}");
            
        } catch (IOException | ServletException e) {
            // Filter chain error
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Internal server error\"}");
        }
    }
    
    /**
     * Check if the request is for a public endpoint that doesn't require authentication.
     */
    private boolean isPublicEndpoint(String path, String method) {
        // Actuator endpoints
        if (path.startsWith("/actuator")) {
            return true;
        }
        
        // Hello endpoint
        if (path.equals("/api/hello")) {
            return true;
        }
        if (path.equals("/api/health")) {
            return true;
        }
        
        // GET requests to public endpoints
        if ("GET".equalsIgnoreCase(method)) {
            return path.startsWith("/api/colleges") ||
                   path.startsWith("/api/categories") ||
                   path.startsWith("/api/events") ||
                   path.startsWith("/api/reviews") ||
                   path.startsWith("/api/registrations") ||
                   path.startsWith("/api/teams") ||
                   path.startsWith("/api/tickets") ||
                   path.startsWith("/api/payments");
        }
        
        return false;
    }
}
