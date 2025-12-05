# 🌐 Estrategia de Escalabilidad para Escenarios de Alto Volumen

Este informe presenta la arquitectura propuesta para garantizar la resiliencia, escalabilidad y capacidad de respuesta de una plataforma de transacciones ante picos elevados de concurrencia, especialmente en operaciones de **escritura** (`POST /transaction`) y **lectura** (`GET /transaction/:id`).

---

## 1. 🧩 Principio 1: Desacoplamiento Asíncrono y Tolerancia a Picos

La solución adopta un patrón basado en **Apache Kafka** como bus de eventos para desacoplar la creación de transacciones del proceso de validación, asegurando que la API no se bloquee ante cargas altas.

---

## 1.1. 🚀 Gestión de la Escritura (Alto Rendimiento)

El flujo está optimizado para liberar rápidamente los hilos del servidor.

### 🏗️ Componentes del Flujo de Datos

| Componente                    | Función                                                        | Impacto en Alto Volumen                                              |
| ----------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------- |
| **API de Transacciones**      | Registra en DB con estado `PENDING` y publica evento en Kafka. | Libera el thread instantáneamente evitando timeouts bajo alta carga. |
| **Kafka**                     | Buffer y cola distribuida.                                     | Absorbe picos de tráfico y protege la API de sobresaturación.        |
| **Microservicio Anti-Fraude** | Consume y valida transacciones de forma asíncrona.             | Escala horizontalmente permitiendo validación masiva simultánea.     |

---

## 1.2. ⚡ Lectura Optimizada (Baja Latencia)

Para garantizar tiempos de respuesta mínimos en consultas GET se aplican dos estrategias:

### 🗄️ Optimización en PostgreSQL

* **Índices Estratégicos**

  * `transactionExternalId`
  * `transactionStatus`
* **Pool de Conexiones** para evitar saturación.

### 🚀 Caching Persistente (Redis)

Beneficioso debido a que el estado final es **inmutable**.

* Primer GET → consulta DB
* GET posteriores → Redis
* **TTL recomendado:**

  * Bajo: estados `PENDING`
  * Alto: estados finales `APPROVED`/`REJECTED`

---

## 2. 🔒 Gestión de Consistencia en Alta Concurrencia

### 2.1. Garantía de Orden y Atomicidad

#### ✔️ Orden de Procesamiento con Kafka

* Usar **transactionExternalId como key**
* Asegura que todos los mensajes de una transacción vayan a **la misma partición**
* Procesamiento **estrictamente secuencial**

#### ✔️ Atomicidad en Base de Datos

* `transactionRepository.update(...)`

  * Operación DML atómica
  * Minimiza condiciones de carrera

---

### 2.2. 🔀 Particionamiento para Rendimiento Masivo

Para cargas extremadamente altas:

* Crear **10 a 20 particiones** en el tópico `transaction-created`
* Permite escalar el Anti-Fraude **horizontalmente**
* Aumenta el throughput del consumo de manera lineal

---

## 3. 🏗️ Despliegue en Producción: Separación Física

Se recomienda dividir los servicios en contenedores independientes para mayor resiliencia y escalabilidad.

### 📦 Microservicios Propuestos

| Contenedor            | Responsabilidad Principal                          |
| --------------------- | -------------------------------------------------- |
| **API Transacciones** | Manejo HTTP y publicación de eventos.              |
| **Anti-Fraude**       | Procesamiento de reglas y consumo de eventos.      |
| **DB Updater**        | Persistencia final de estados en la base de datos. |

### 🎯 Beneficios

* Escalamiento independiente por servicio
* Aislamiento de fallos
* Uso eficiente de recursos
* Arquitectura flexible y evolutiva

---

## 🏁 Conclusión

La estrategia presentada garantiza:

* Respuesta rápida incluso bajo miles de solicitudes por segundo
* Consistencia fuerte en escenarios críticos
* Capacidad de absorber picos mediante desacoplamiento
* Escalabilidad horizontal real gracias a Kafka + microservicios independientes
* Baja latencia en lecturas con PostgreSQL + Redis

Esta arquitectura está lista para soportar un entorno de **microservicios transaccionales de misión crítica**.