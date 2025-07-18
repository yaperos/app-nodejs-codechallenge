# Business Transaction API

> ⚠️ **IMPORTANTE**: Esta API debe ejecutarse **ANTES** que el Business Transaction Anti-Fraud Service

## 🚀 Ejecución Local con Docker

### 1. Clonar el repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd business-transaction-v1
```

### 2. Construir e iniciar
```bash
docker-compose up --build -d
```

### 3. Acceder a los servicios

| Servicio | URL |
|----------|-----|
| **API REST** | http://localhost:3000 |
| **Swagger** | http://localhost:3000/api |
| **Kafka Manager** | http://localhost:9000 |

### 4. Comandos útiles

```bash
# Ver logs
docker logs -f transaction-api

# Parar servicios
docker-compose down

# Limpieza completa
docker-compose down -v --remove-orphans; docker system prune -af
```

## 📋 Endpoints

- `GET /transactions` - Listar transacciones
- `GET /transactions/:id` - Obtener por ID
- `POST /transactions` - Crear transacción
- `DELETE /transactions/:id` - Eliminar transacción

