# ---------- Build stage ----------
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build

COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B package


# ---------- Runtime stage ----------
FROM eclipse-temurin:17-jre
WORKDIR /work

COPY --from=build /build/target/quarkus-app/lib/ lib/
COPY --from=build /build/target/quarkus-app/app/ app/
COPY --from=build /build/target/quarkus-app/quarkus/ quarkus/
COPY --from=build /build/target/quarkus-app/quarkus-run.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java","-Dquarkus.profile=prod","-jar","app.jar"]
