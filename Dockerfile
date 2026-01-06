## Build stage
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /workspace

# Copy pom and sources
COPY pom.xml mvnw ./
COPY .mvn .mvn
COPY src ./src

RUN mvn -B -DskipTests package -DskipITs


## Runtime stage
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /workspace/target/*.jar ./app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
