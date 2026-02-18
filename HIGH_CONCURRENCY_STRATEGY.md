# High Concurrency Strategy

### Cómo escalar la solución en escenarios de alto volumen de transacciones

Este documento explica las estrategias recomendadas para soportar escenarios con **alto volumen de lectura y escritura simultánea**, manteniendo consistencia, resiliencia y buen rendimiento. Todas las propuestas están alineadas con la arquitectura actual del proyecto (Java, Kafka, microservicios con enfoque hexagonal).

---

## 1. Uso de Kafka para desacoplamiento y absorción de carga

Kafka actúa como **buffer natural** entre ms-transaction y ms-anti-fraud.

Beneficios en alta concurrencia:

* Maneja millones de mensajes por segundo.
* Garantiza procesamiento secuencial por partición.
* Permite escalar consumidores horizontalmente.
* Evita que la carga de validación impacte directamente al microservicio de creación.

**Estrategia propuesta:**

* Aumentar particiones en el topic `transaction-created`.
* Habilitar múltiples instancias del anti-fraud service como **consumer group**, cada una procesando particiones diferentes.
* Usar claves (key = `transactionExternalId`) para mantener orden en mensajes relacionados a una misma transacción.

---

## 2. Idempotencia en actualización de estado

En escenarios de alto volumen, pueden generarse eventos duplicados o llegados en desorden.

**Estrategia propuesta:**

* La actualización de transacción debe ser **idempotente**:
  si llega un mensaje con el mismo `transactionExternalId` y el mismo estado, la operación no debe causar inconsistencias.
* El repositorio JPA debe buscar primero por `transactionExternalId` y solo actualizar si el estado cambió realmente.

Esto ya se cumple parcialmente en la solución implementada, pero se documenta como fundamento técnico.

---

## 3. Optimistic Locking en la base de datos

Para evitar condiciones de carrera al actualizar el estado de una transacción:

**Estrategia propuesta:**

* Agregar un campo `@Version` en la entidad JPA (`@Version Long version;`)
* Esto evita que dos consumidores actualicen simultáneamente la misma fila causando inconsistencias.
* Si ocurre un conflicto, JPA lanza exception y se puede reintentar (retry simple o backoff exponencial).

---

## 4. Índices en columnas críticas

Al aumentar la carga, el tiempo de consulta puede crecer si la base no está optimizada.

**Recomendación:**

* Crear índices en:

  * `transactionExternalId`
  * `createdAt`
  * `transactionStatus`

Esto acelera:

* búsquedas puntuales (GET transaction)
* actualizaciones basadas en ID externo

---

## 5. Segmentación de carga por microservicios

La arquitectura ya contempla separación entre:

* microservicio de creación (**ms-transaction**)
* microservicio de validación (**ms-anti-fraud**)

Para escenarios de alta concurrencia:

* Escalar **independientemente** el ms-transaction cuando crecen las escrituras.
* Escalar **independientemente** el anti-fraud cuando crece la validación.
* Kafka absorbe el desacople sin saturar ninguno de los dos.

---

## 6. Cache para lecturas intensivas (opcional)

Si aumenta mucho el volumen de lecturas (GET transaction), la base de datos puede convertirse en cuello de botella.

**Solución sugerida (opcional):**

* Cache para transacciones recién creadas o consultadas (Redis)
* Expiración corta (TTL 30-60s)

Esto reduce hasta el 80% de lecturas a DB.

---

## 7. Failover y resiliencia de eventos

Para asegurar entrega confiable:

* Habilitar **retries** en el producer de Kafka.
* Configurar **dead-letter-topic** para eventos que no se puedan procesar.
* Asegurar que los consumidores sean **at-least-once delivery** (la solución actual ya lo cumple).

---

## 8. Consistencia eventual y diseño orientado a eventos

El sistema funciona bajo un patrón de **eventual consistency**:

* La transacción se crea como `pending`
* Anti-fraud responde asíncronamente
* ms-transaction actualiza estado cuando recibe el evento

Esto es ideal para alta concurrencia porque:

* No bloquea peticiones sincronamente
* Mantiene alto throughput
* Reduce latencia percibida por el usuario

---

## 9. Monitoreo y Observabilidad

Para ambientes productivos se recomienda:

* Métricas de Kafka (lag, throughput)
* Métricas de JPA (tiempos de consulta)
* Dashboards de estado de consumidores
* Alertas por retraso en procesamiento de particiones

Esto permite anticipar saturación y escalar antes de fallar.

---

# Conclusión

La solución propuesta soporta carga alta gracias al diseño basado en eventos, el desacoplamiento con Kafka, y la separación de responsabilidades entre microservicios.

Para escenarios extremos, las estrategias detalladas permiten:

* escalar horizontalmente ambos servicios,
* procesar millones de eventos de forma ordenada e idempotente,
* evitar condiciones de carrera,
* y optimizar las lecturas en tiempo real.

Este documento complementa la entrega técnica sin necesidad de modificar la implementación actual.