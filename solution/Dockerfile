FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copiamos el pom.xml y descargamos las dependencias (cache optimization)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiamos el código fuente y generamos el archivo JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Run (Ejecución)
# Usamos una imagen ligera de JRE 21 para correr la app
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copiamos el JAR generado en la etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Exponemos el puerto del microservicio
EXPOSE 8081

# Ejecutamos la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]