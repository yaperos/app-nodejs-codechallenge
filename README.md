# Yape - Challenge Solution :rocket:

- [Descripción](#Descripción)
- [Instalación](#Instalación)
- [Diagrama de Arquitectura](#Diagrama_de_Arquitectura)

# Descripción

Se realizó una solución que disponibiliza un conjunto de apis que internamente se comunican
con un microservicio antifraude, al cual se comunica mediante kafka, toda información generada se almacena en mongobd.

- MongoDb: Base de datos.
- NestJS (Transaction): Funciona como backend y apiGateway entre internet y el microservicio
- NestJS (antifraud): Microservicio que implementa una conexión Kafka para la comunicación
- confluentinc/cp-kafka: Kafka server.
- provectuslabs/kafka-ui: Web app para administración y GUI de kafka.

# Instalación

- [Instalación en local](./docs/local-deploy.md)
- [Capturas](./docs/software-description.md)

# Diagrama de Arquitectura

El software incluye una implementación de un apiGateway (backend) que se comunica con el microservicio mediante TRANSPORT.KAFKA.

```mermaid
sequenceDiagram
    autonumber
    actor user
    participant nestTransaction
    participant kafka
    participant nestAntifraud
    participant mongodb

    Note over user,nestTransaction: User side

    user-->>nestTransaction: Request Create transaction

    Note over nestTransaction,mongodb: Server side

    nestTransaction-->>mongodb: Create pending transaction

    Note over nestTransaction,nestAntifraud: Kafka side

    alt Message Pattern
        alt Topic [antifraud]
            nestTransaction->>+kafka: Produce
            kafka->>-nestAntifraud: Consume
        end

        nestAntifraud->>nestAntifraud: Define new state
        Note right of nestAntifraud: Antifraud algorithm...

        alt Topic [antifraud.reply]
            nestAntifraud->>+kafka: Produce
            kafka->>-nestTransaction: Consume
        end
    end

    Note over nestTransaction,nestAntifraud: Kafka side

    nestTransaction->>mongodb: Update state

    nestTransaction->>mongodb: Get all transaction info

    nestTransaction->>user: Show transaction
```
