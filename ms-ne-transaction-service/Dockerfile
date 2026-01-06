# Stage 1: Build
FROM gradle:8.5-jdk21-alpine AS builder

WORKDIR /workspace/app

COPY build.gradle settings.gradle ./
COPY src src

RUN gradle clean build -x test --no-daemon

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine

RUN apk add --no-cache curl

WORKDIR /app

COPY --from=builder /workspace/app/build/libs/*.jar app.jar

EXPOSE 9992

ENTRYPOINT ["java", "-jar", "app.jar"]
