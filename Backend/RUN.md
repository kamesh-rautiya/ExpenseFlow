# ExpenseFlow Backend — Local Run Guide

## Requirements
- Java 17
- Docker Desktop
- macOS/Linux terminal

## 1. Start the backend
No Docker required for local development. The default profile uses an in-memory H2 database and loads seed data automatically.

```bash
chmod +x mvnw
export JAVA_HOME=$(/usr/libexec/java_home -v 21 2>/dev/null || /usr/libexec/java_home)
./mvnw spring-boot:run
```

The backend starts on:

`http://localhost:8000/api`

Health check:

`http://localhost:8000/api/`

Swagger UI:

`http://localhost:8000/api/swagger-ui/index.html`

To use MySQL in Docker instead:

```bash
docker compose up -d
./mvnw spring-boot:run -Dspring-boot.run.profiles=mysql
```

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
