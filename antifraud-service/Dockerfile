# Build stage
FROM maven:3.9.5-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the entire project (parent POM needs to see all modules)
COPY . .

# Build only antifraud-service and its dependencies
RUN mvn clean package -DskipTests -pl antifraud-service -am

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/antifraud-service/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]

