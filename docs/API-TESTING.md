# API Testing Guide

## Overview

Guía para probar las APIs del Transaction Service y Anti-Fraud Service.

## Quick Start

### 1. Iniciar Servicios

```bash
# Opción A: Docker (Recomendado)
docker-compose up -d

# Opción B: Local
npm run start:dev
```

### 2. Verificar Logs de Servicios

```bash
docker logs transaction-service -f
docker logs anti-fraud-service -f
```

### 3. Ejecutar Test Automatizado

```bash
npm run test:api
```

### 4. Postman

También puedes importar la colección de Postman ubicada en:
`docs/collection/RETO YAPE.postman_collection.json`

## Escenarios de Testing

El script `test/api/test-transaction-api.sh` cubre:

1. Verificación de logs del servicio
2. Crear transacción válida (< 1000)
3. Consultar transacción por ID
4. Crear transacción de alto valor (> 1000) para verificar anti-fraude

## Reglas de Anti-Fraude

| Valor de Transacción | Status Esperado | Acción |
|----------------------|----------------|---------|
| < 1000 | PENDING → APPROVED | Normal |
| 1001 - 5000 | PENDING → REJECTED | Alto riesgo |
| > 5000 | PENDING → REVIEW | Muy alto - requiere revisión (Regla desactivada por defecto) |

## Pruebas Manuales con curl

### Crear Transacción

```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "accountExternalIdDebit": "550e8400-e29b-41d4-a716-446655440000",
    "accountExternalIdCredit": "550e8400-e29b-41d4-a716-446655440001",
    "tranferTypeId": 1,
    "value": 500
  }'
```

### Obtener Transacción

```bash
curl http://localhost:3000/transactions/{transaction-id}
```

### Debugging

```bash
# Ver logs
docker logs transaction-service -f
docker logs anti-fraud-service -f

# Curl verbose (Verificar cabeceras)
curl -v http://localhost:3000/transactions/{transaction-id}
```

## Troubleshooting

### Servicios no responden
```bash
# Verificar estado
docker ps

# Reiniciar servicios
docker-compose restart
```

### Ver logs de errores
```bash
docker logs transaction-service
docker logs anti-fraud-service
```
