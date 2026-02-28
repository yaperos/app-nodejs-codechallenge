# Stage 1: Build
FROM gradle:8-jdk21 AS build
WORKDIR /app
COPY build.gradle settings.gradle ./
COPY src ./src
COPY gradle ./gradle
COPY gradlew ./
COPY gradlew.bat ./
RUN chmod +x gradlew
RUN ./gradlew build -x test

# Stage 2: Run
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
