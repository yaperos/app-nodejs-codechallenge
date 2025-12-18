FROM eclipse-temurin:21-jre

WORKDIR /app

RUN useradd -r -u 1001 appuser
USER appuser

COPY yape-anti-fraud-api-0.0.1-SNAPSHOT.jar /app/app.jar

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -jar /app/app.jar"]
