FROM maven:3.9-eclipse-temurin-17-alpine AS build

WORKDIR /app

# Copiar archivos de Maven
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar código fuente y compilar
COPY src ./src
RUN mvn clean package -DskipTests

# Imagen final
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiar el JAR compilado
COPY --from=build /app/target/*.jar app.jar

# Exponer puerto
EXPOSE 8080

# Punto de entrada
ENTRYPOINT ["java", "-jar", "app.jar"]
