# Business Transaction Anti-Fraud Service

Microservicio de detección de fraudes para transacciones comerciales desarrollado con NestJS y Kafka.

> ⚠️ **IMPORTANTE**: Ejecutar primero la Business Transaction API antes de este servicio.

## 🚀 Ejecución Local con Docker

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd business-transaction-anti-fraud-v1
```

### 2. Ejecutar con Docker
```bash
docker-compose up --build -d
```

### 3. Ver logs
```bash
docker-compose logs -f fraud-detector
```

## 📋 URLs

- **API**: `http://localhost:8082`
- **Health**: `http://localhost:8082/transaction-anti-fraud/v1/health`
- **Kafka Manager**: `http://localhost:9000`

## 🛠️ Comandos útiles

```bash
# Detener
docker-compose down

# Reconstruir
docker-compose up --build -d

# Ver estado
docker-compose ps
```

