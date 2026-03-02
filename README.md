# Transaction Service

Microservicio desarrollado con Spring Boot para la gestión de transacciones financieras y validación antifraude.

---

## 🚀 Tecnologías Utilizadas

- Java 21
- Spring Boot 3.2.5
- Spring Data JPA
- H2 Database (Base de datos en memoria)
- Maven
- Lombok
- OpenAPI / Swagger

---

## 🏗 Arquitectura

El proyecto sigue una arquitectura en capas:

```
controller → service → repository → entity → dto
```

Estructura principal:

```
src
 └─ main
     ├─ java
     │   └─ com.yape.transactionservice
     │        ├─ controller
     │        ├─ service
     │        ├─ repository
     │        ├─ entity
     │        └─ dto
     └─ resources
```

---

## ▶️ Cómo Ejecutar el Proyecto

### 1️⃣ Compilar el proyecto

```bash
mvn clean install
```

### 2️⃣ Ejecutar la aplicación

```bash
mvn spring-boot:run
```

La aplicación se ejecutará en:

```
http://localhost:8081/api
```

---

## 🗄 Base de Datos

Se utiliza H2 en memoria.

### Consola H2

```
http://localhost:8081/api/h2-console
```

Credenciales:

```
JDBC URL: jdbc:h2:mem:transactiondb
User: sa
Password: (vacío)
```

La base de datos se reinicia cada vez que la aplicación se detiene.

---

## 📚 Documentación Swagger

Una vez levantada la aplicación:

```
http://localhost:8081/api/swagger-ui/index.html
```

Swagger permite:
- Visualizar endpoints
- Probar requests
- Ver modelos de request y response

---

# 📌 Endpoints

## 🔹 1. Crear Transacción

**POST** `/api/transactions`

### Request

```json
{
  "accountExternalIdDebit": 1001,
  "accountExternalIdCredit": 2001,
  "tranferTypeId": 1,
  "amount": 120.50
}
```

### Response

```json
{
  "transactionExternalId": 1,
  "transactionType": {
    "id": 1,
    "name": "TRANSFER"
  },
  "transactionStatus": {
    "id": 1,
    "name": "PENDING"
  },
  "amount": 120.50,
  "createdAt": "2026-03-02T17:00:00"
}
```

---

## 🔹 2. Obtener Transacción

**GET** `/api/transactions/{id}`

### Ejemplo

```
GET /api/transactions/1
```

### Response

```json
{
  "transactionExternalId": 1,
  "transactionType": {
    "id": 1,
    "name": "TRANSFER"
  },
  "transactionStatus": {
    "id": 2,
    "name": "APPROVED"
  },
  "amount": 120.50,
  "createdAt": "2026-03-02T17:00:00"
}
```

---

## 🔹 3. Validar Transacción (AntiFraud)

**POST** `/api/transactions/validate/{id}`

### Ejemplo

```
POST /api/transactions/validate/1
```

### Response

```json
{
  "transactionId": 1,
  "status": "APPROVED"
}
```

---

# 🛡 Reglas de Negocio (Ejemplo AntiFraude)

- La aprobación o rechazo producto de la validación es aleatoria para efectos de éste reto técnico
- El estado inicial de una transacción es PENDING

---

# 🧪 Testing

Para ejecutar pruebas (si existen):

```bash
mvn test
```

---

# 📈 Mejoras Futuras

- Migración a PostgreSQL
- Implementación de Docker
- Manejo global de excepciones (@ControllerAdvice)
- Logs estructurados
- Pruebas unitarias y de integración

---

# 👨‍💻 Autor

Proyecto desarrollado como parte de un reto técnico backend.

