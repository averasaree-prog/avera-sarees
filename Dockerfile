# Multi-stage Dockerfile for AVERA Spring Boot Backend
FROM maven:3.9.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Cache Maven dependencies
COPY backend/pom.xml backend/
RUN mvn -f backend/pom.xml dependency:go-offline -B

# Copy backend source code and build production JAR
COPY backend/src backend/src
RUN mvn -f backend/pom.xml clean package -DskipTests -B

# Minimal Alpine JRE runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S avera && adduser -S avera -G avera
USER avera:avera

# Copy JAR from build stage
COPY --from=build --chown=avera:avera /app/backend/target/saree-store-backend-1.0.0.jar app.jar

ENV SPRING_PROFILES_ACTIVE=prod
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]

