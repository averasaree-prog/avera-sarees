# Multi-stage Dockerfile when Root Directory is set to 'backend'
FROM maven:3.9.9-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Cache Maven dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy backend source and compile production JAR
COPY src ./src
RUN mvn clean package -DskipTests -B

# Minimal Alpine JRE runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create non-root user for security
RUN addgroup -S avera && adduser -S avera -G avera
USER avera:avera

# Copy built JAR
COPY --from=build --chown=avera:avera /app/target/saree-store-backend-1.0.0.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
