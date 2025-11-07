#!/bin/bash
# Render Build Script for Spring Boot Backend

echo "🚀 Starting Render Build Process..."

# Set Java version
echo "☕ Setting up Java 17..."
export JAVA_HOME=/opt/java/openjdk
export PATH=$JAVA_HOME/bin:$PATH
java -version

# Build the application with Maven
echo "📦 Building Spring Boot application..."
cd backend

# Clean and build
./mvnw clean package -DskipTests

# Verify the JAR was created
if [ -f "target/festify-backend-0.0.1-SNAPSHOT.jar" ]; then
    echo "✅ Build successful! JAR created."
    ls -lh target/festify-backend-0.0.1-SNAPSHOT.jar
else
    echo "❌ Build failed! JAR not found."
    exit 1
fi

echo "✨ Build complete!"
