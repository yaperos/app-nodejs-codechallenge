FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app

COPY pom.xml .
COPY common/pom.xml common/pom.xml
COPY transaction-service/pom.xml transaction-service/pom.xml
COPY antifraud-service/pom.xml antifraud-service/pom.xml

RUN mvn dependency:go-offline -pl antifraud-service -am -q

COPY common/src common/src
COPY antifraud-service/src antifraud-service/src

RUN mvn clean package -pl antifraud-service -am -DskipTests -q

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/antifraud-service/target/*.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]