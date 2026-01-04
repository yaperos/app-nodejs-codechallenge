
# Build stage
FROM maven:3.9.5-eclipse-temurin-21 AS build
WORKDIR /app

# Copy the entire project (parent POM needs to see all modules)
COPY . .

# Build only transaction-service and its dependencies
RUN mvn clean package -DskipTests -pl transaction-service -am

# Run stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=build /app/transaction-service/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
