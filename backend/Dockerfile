# Multi-stage Dockerfile: build the Spring Boot jar and produce a small runtime image
# Build stage
FROM maven:3.9.4-eclipse-temurin-17 as builder
WORKDIR /workspace

# copy only what is needed for maven to download dependencies first (cache-friendly)
COPY backend/pom.xml ./backend/pom.xml
RUN mvn -f backend/pom.xml -q -DskipTests dependency:go-offline

# copy source and build
COPY backend ./backend
RUN mvn -f backend/pom.xml -DskipTests package -q

# Runtime stage
FROM eclipse-temurin:17-jre-jammy
ARG JAR_FILE=backend/target/festify-backend-0.0.1-SNAPSHOT.jar
WORKDIR /app
COPY --from=builder /workspace/${JAR_FILE} ./app.jar

# Expose default port
EXPOSE 8080

# Prefer environment variables for datasource configuration. Example envs:
# SPRING_DATASOURCE_URL=jdbc:postgresql://db.supabase.co:5432/postgres
# SPRING_DATASOURCE_USERNAME=postgres
# SPRING_DATASOURCE_PASSWORD=secret

ENV JAVA_OPTS="-Xms256m -Xmx512m"

ENTRYPOINT ["sh","-c","exec java $JAVA_OPTS -jar /app/app.jar"]
