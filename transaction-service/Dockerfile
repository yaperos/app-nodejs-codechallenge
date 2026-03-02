FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

# Copiar poms
COPY pom.xml .
COPY common/pom.xml common/pom.xml
COPY transaction-service/pom.xml transaction-service/pom.xml
COPY antifraud-service/pom.xml antifraud-service/pom.xml

# Descargar dependencias (cache layer)
RUN mvn dependency:go-offline -pl transaction-service -am -q

# Copiar fuentes
COPY common/src common/src
COPY transaction-service/src transaction-service/src

# Build
RUN mvn clean package -pl transaction-service -am -DskipTests -q

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/transaction-service/target/*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]