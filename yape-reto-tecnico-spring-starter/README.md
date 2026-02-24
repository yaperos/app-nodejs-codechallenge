# Reto Técnico Yape

## Descripción

Este proyecto implementa un sistema simple de transferencias compuesto por dos microservicios:

- `transaction-service`
- `antifraud-service`

El `transaction-service` se encarga de registrar la transacción y publicar un evento.  
El `antifraud-service` consume ese evento, evalúa una regla antifraude y actualiza el estado final de la transacción.

La comunicación entre servicios es asíncrona utilizando Kafka.

---

## Arquitectura

El flujo del sistema es el siguiente:

1. Un cliente crea una transacción.
2. La transacción se guarda en la base de datos con estado **PENDING**.
3. Se publica un evento en Kafka.
4. El servicio antifraude consume el evento.
5. El servicio antifraude evalúa la transacción.
6. El servicio antifraude actualiza el estado a **APPROVED** o **REJECTED**.

El sistema es de consistencia eventual, es decir, la transacción no se aprueba o rechaza inmediatamente.

---

## Regla antifraude

Toda transacción con un valor mayor a **1000** es rechazada.

- value ≤ 1000 → APPROVED
- value > 1000 → REJECTED

Esta validación es realizada por el `antifraud-service` y no por el `transaction-service`.

---

## Tecnologías usadas

- Java 17
- Spring Boot
- Spring Data JPA
- PostgreSQL
- Apache Kafka
- Docker Compose

---

## Cómo ejecutar

Primero levantar la infraestructura:

```bash
docker compose up -d