# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM eclipse-temurin:25-jdk-alpine AS builder

WORKDIR /app

# Copia solo el pom primero para aprovechar cache de capas de Docker
# Si el pom no cambia, Maven no re-descarga dependencias en rebuilds
COPY pom.xml .
COPY .mvn/ .mvn/
COPY mvnw .

RUN chmod +x mvnw && \
    ./mvnw dependency:go-offline -B

# Copia el código fuente y compila
COPY src/ src/

RUN ./mvnw clean package -DskipTests -B && \
    mkdir -p target/extracted && \
    java -Djarmode=layertools -jar target/*.jar extract --destination target/extracted

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM eclipse-temurin:25-jre-alpine AS runtime

# Usuario no-root por seguridad
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Capas del JAR en orden de menor a mayor frecuencia de cambio
# Esto optimiza el cache de Docker en rebuilds sucesivos
COPY --from=builder --chown=appuser:appgroup /app/target/extracted/dependencies/ ./
COPY --from=builder --chown=appuser:appgroup /app/target/extracted/spring-boot-loader/ ./
COPY --from=builder --chown=appuser:appgroup /app/target/extracted/snapshot-dependencies/ ./
COPY --from=builder --chown=appuser:appgroup /app/target/extracted/application/ ./

USER appuser

# Puerto REST + GraphQL WebSocket
EXPOSE 8080

# Opciones JVM optimizadas para contenedores:
# -XX:+UseContainerSupport          → detecta límites de CPU/RAM del contenedor
# -XX:MaxRAMPercentage              → usa hasta el 75% de la RAM asignada al contenedor
# -XX:+UseZGC                       → GC de baja latencia, ideal para servicios reactivos
# -Djava.security.egd               → acelera el arranque en entornos sin /dev/random
ENV JAVA_OPTS="-XX:+UseContainerSupport \
               -XX:MaxRAMPercentage=75.0 \
               -XX:+UseZGC \
               -Djava.security.egd=file:/dev/./urandom \
               -Dspring.profiles.active=docker"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS org.springframework.boot.loader.launch.JarLauncher"]