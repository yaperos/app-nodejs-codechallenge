FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y openjdk-17-jdk openjdk-17-jre maven && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /transaction-services

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

CMD ["java", "-jar", "target/anti-fraud-services-0.0.1-SNAPSHOT.jar"]