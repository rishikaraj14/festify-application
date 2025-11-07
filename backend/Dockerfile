# Multi-stage Dockerfile for Festify Backend (Spring Boot)
# Optimized for production deployment

# ============================================
# Stage 1: Build the application
# ============================================
FROM maven:3.9.9-eclipse-temurin-17-alpine AS builder

WORKDIR /app

# Copy pom.xml and download dependencies (cached if pom.xml unchanged)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build
COPY src ./src
RUN mvn clean package -DskipTests -B

# ============================================
# Stage 2: Create optimized runtime image
# ============================================
FROM eclipse-temurin:17-jre-alpine

# Install curl for health checks
RUN apk add --no-cache curl tzdata

# Set timezone (optional, adjust as needed)
ENV TZ=Asia/Kolkata

# Create non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring

WORKDIR /app

# Copy JAR from builder stage
COPY --from=builder /app/target/festify-backend-*.jar app.jar

# Change ownership to spring user
RUN chown -R spring:spring /app

# Switch to non-root user
USER spring:spring

# Expose application port
EXPOSE 8080

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# JVM options optimized for containers
ENV JAVA_OPTS="-XX:+UseContainerSupport \
               -XX:MaxRAMPercentage=75.0 \
               -XX:InitialRAMPercentage=50.0 \
               -XX:+UseG1GC \
               -XX:MaxGCPauseMillis=100 \
               -XX:+UseStringDeduplication \
               -XX:+ExitOnOutOfMemoryError \
               -Djava.security.egd=file:/dev/./urandom \
               -Dspring.profiles.active=prod"

# Environment variables (override these at runtime)
# Required: DB_URL, DB_USER, DB_PASS, JWT_SECRET
# Optional: SMTP_USER, SMTP_PASS, SMTP_FROM, ADMIN_EMAIL, ADMIN_PASS

# Application startup
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
