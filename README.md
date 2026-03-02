# Solución Técnica - Sistema de Transacciones con Anti-Fraude

La estructura del proyecto es hexagonal, con dos microservicios principales: `Transaction` y `Antifraud`.

## 📋 Stack Tecnológico

- **Java 17** - Lenguaje base
- **Spring Boot 3.5.11** - Framework principal
- **Spring WebFlux** - Programación reactiva no bloqueante
- **R2DBC** - Operaciones reactivas con base de datos
- **Apache Kafka** - Mensajería asíncrona
- **PostgreSQL** - Base de datos persistente

---

## 🏗️ Arquitectura

### Gestión de Concurrencia
- **Bloqueo Optimista**: Maneja actualizaciones concurrentes sin bloquear lecturas
- **Control de Duplicados**: Prevención de transacciones duplicadas

### Tipos de Transacción
- `1` = Depósito
- `2` = Retiro

## 🔄 Flujo de Comunicación

### Servicio de Transacciones (Transaction)
**Produce a**: `anti-fraud-topic`
- Datos de transacción recién creada (estado: `PENDING`)
- Inmediatamente después de persistir envia el mensaje a Kafka para validación

**Consume de**: `transaction-topic`
- Estado final de validación (`APPROVED` / `REJECTED`)
- Acción: Actualiza estado en base de datos

### Servicio Anti-Fraude (Antifraud)
**Consume de**: `anti-fraud-topic`
- Transacción a validar
- Rechaza transacciones con valor > $1000

**Produce a**: `transaction-topic`
- Resultado de validación con ID de transacción y nuevo estado
- Después de procesar cada mensaje, envía el resultado a Kafka para que Transaction actualice su estado

---

## 🚀 Cómo Ejecutar

Se tiene 2 modos de ejecución: Local (Infraestructura con docker y microservicios corriendo en tu máquina) o Automatizado (con todo el sistema dockerizado).

### 💻 MODO LOCAL

#### 1. Levantar infraestructura
```powershell
docker-compose -f docker-compose.local.yml up -d
```

**Incluye:**
- PostgreSQL (puerto 5432)
- Zookeeper (puerto 2181)
- Kafka (puerto 9092)

#### 2. Ejecutar microservicios desde el IDE

### Requisitos Previos

### Java 17
Este proyecto requiere **Java 17**. Asegúrate de tener instalado JDK 17 y configurado en tu variable de entorno `JAVA_HOME`.

#### Windows
```powershell
# Verificar versión de Java
java -version

# Configurar JAVA_HOME (reemplaza la ruta con tu instalación de JDK 17)
setx JAVA_HOME "C:\Program Files\Java\jdk-17"
setx PATH "%JAVA_HOME%\bin;%PATH%"

# Reinicia tu terminal para aplicar cambios
```

#### Mac
```bash
# Verificar versión de Java
java -version

# Configurar JAVA_HOME en ~/.zshrc o ~/.bash_profile
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH

# Aplicar cambios
source ~/.zshrc  # o source ~/.bash_profile
```

**Opción A - Terminal:**
```powershell
# Terminal 1 - Antifraud
cd antifraud
./mvnw spring-boot:run

# Terminal 2 - Transaction
cd transaction
./mvnw spring-boot:run
```

**Opción B - IntelliJ IDEA:**
- Click derecho en `AntifraudApplication.java` → Run
- Click derecho en `TransactionApplication.java` → Run

---

### 🐳 MODO AUTOMATIZADO (Docker Completo)

#### Levantar todo el sistema
```powershell
docker-compose up --build -d
```

**Incluye:**
- PostgreSQL
- Zookeeper
- Kafka
- Antifraud (Dockerizado, puerto 8081)
- Transaction (Dockerizado, puerto 8080)

#### Detener
```powershell
docker-compose down
```

---

## 📍 Puertos y Servicios

| Servicio | Puerto | URL |
|----------|--------|-----|
| Transaction | 8080 | http://localhost:8080 |
| Antifraud | 8081 | http://localhost:8081 |
| PostgreSQL | 5432 | localhost:5432 |
| Kafka | 9092 | localhost:9092 |
| Zookeeper | 2181 | localhost:2181 |


---

## 📮 Pruebas con POSTMAN

### 1️⃣ Crear Transacción

**POST** `http://localhost:8080/transactions`

**Body (JSON):**
```json
{
  "accountExternalIdDebit": "6085462b-f1da-48a0-8f11-72ee428b2a32",
  "accountExternalIdCredit": "1cb43a09-01a7-4019-b683-589b6b00ea58",
  "tranferTypeId": 1,
  "value": 900
}
```

**Response (201 CREATED):**
```json
{
  "transactionExternalId": "47f62081-95c7-483b-a000-91c0e391f696"
}
```

---

### 2️⃣ Obtener Transacción

**GET** `http://localhost:8080/transactions/{transactionExternalId}`

**Parámetro:**
- `transactionExternalId`: ID de la transacción a consultar

**Response (200 OK):**
```json
{
  "transactionExternalId": "47f62081-95c7-483b-a000-91c0e391f696",
  "transactionType": {
    "name": "DEPOSIT"
  },
  "transactionStatus": {
    "name": "APPROVED"
  },
  "value": 900.00,
  "createdAt": "2026-03-01T19:11:52.070044"
}
```

---

### 📌 Notas Importantes

- **tranferTypeId**: `1` = Depósito, `2` = Retiro
