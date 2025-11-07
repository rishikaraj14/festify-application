#!/bin/bash
# Render Start Script for Spring Boot Backend

echo "🚀 Starting Festify Backend..."

# Set Java options for Render (512MB-2GB instances)
export JAVA_OPTS="-Xmx450m -Xms256m -XX:+UseG1GC -XX:MaxGCPauseMillis=100 -XX:+UseStringDeduplication"

# Navigate to backend directory
cd backend

# Run the Spring Boot application
echo "🏃 Running Spring Boot application on port $PORT..."
java $JAVA_OPTS -Dserver.port=$PORT -jar target/festify-backend-0.0.1-SNAPSHOT.jar
