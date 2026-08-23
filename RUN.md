# ExpenseFlow Backend — Local Run Guide

## Requirements
- Java 17
- Docker Desktop
- macOS/Linux terminal

## 1. Start MySQL
```bash
docker compose up -d
docker compose ps
```

MySQL is exposed on **localhost:3307**, so it will not conflict with a MySQL server already using port 3306.

## 2. Run Spring Boot
```bash
chmod +x mvnw
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
./mvnw clean spring-boot:run
```

The backend starts on:

`http://localhost:8000/api`

Health check:

`http://localhost:8000/api/`

Swagger UI:

`http://localhost:8000/api/swagger-ui/index.html`

## 3. Database
For local development the application automatically:
- creates the tables from the JPA entities;
- loads `src/main/resources/data.sql`;
- recreates the local schema when the application starts.

This is intentionally configured for development. Do not use `ddl-auto: create` in production.

## Demo users
The included seed data creates:
- `admin@gmail.com`
- `matej@gmail.com`
- `honza@gmail.com`

The password is the same seeded BCrypt password used by the original project.

## Stop
```bash
docker compose down
```

To also remove the database volume:
```bash
docker compose down -v
```
