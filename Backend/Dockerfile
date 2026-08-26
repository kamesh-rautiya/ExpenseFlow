# ── Stage 1: Build ──────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Cache Maven dependencies first (only re-downloads when pom.xml changes)
COPY pom.xml .
COPY .mvn .mvn
RUN mvn dependency:go-offline -B

# Copy source and build the JAR (skip tests for faster deploys)
COPY src ./src
RUN mvn package -DskipTests -B

# ── Stage 2: Runtime ────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy the built JAR
COPY --from=build /app/target/*.jar app.jar

# Switch to non-root user
USER appuser

# Railway injects PORT; Spring Boot reads server.port
ENV PORT=8000
EXPOSE ${PORT}

# Use production profile; env vars are injected by Railway
# Shell form so $PORT is expanded at runtime
ENTRYPOINT java -Dserver.port=$PORT -Dspring.profiles.active=prod -jar app.jar
