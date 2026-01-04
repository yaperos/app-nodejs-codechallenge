# Anti-Fraud Service

Microservicio de validación anti-fraude para Yape Challenge. Valida transacciones en tiempo real mediante eventos de Kafka.

## 🎯 Características

- ✅ **Validación en Tiempo Real**: Procesamiento de transacciones vía Kafka
- ✅ **Reglas de Negocio**: Validación de montos y detección de fraude
- ✅ **Comunicación Asíncrona**: Integración completa con Kafka
- ✅ **Arquitectura Reactiva**: Procesamiento event-driven
- ✅ **Spring Boot 3.2**: Framework moderno y optimizado

## 🚀 Ejecución

### Con Docker Compose (recomendado)

Desde la raíz del proyecto:
```bash
docker-compose up antifraud-service --build
```

### Con Docker

Construir la imagen:
```bash
docker build -t antifraud-service:latest -f antifraud-service/Dockerfile .
```

Ejecutar el contenedor:
```bash
docker run -p 8081:8081 \
  -e SPRING_PROFILES_ACTIVE=docker,antifraud \
  -e SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:29092 \
  antifraud-service:latest
```

### Con Maven

Compilar y ejecutar localmente:
```bash
cd antifraud-service
mvn clean package -DskipTests
java -jar target/antifraud-service-*.jar
```

**Nota**: Asegúrate de tener Kafka ejecutándose localmente.

## 📡 Funcionalidad

### Puerto
- **8081**

### Validación Anti-Fraude

Este servicio escucha eventos de transacciones desde Kafka y aplica las siguientes reglas:

#### Reglas de Validación

1. **Monto Máximo**: Transacciones con valor > 1000 son rechazadas
2. **Estados Posibles**:
   - ✅ `APPROVED`: Transacción válida (valor ≤ 1000)
   - ❌ `REJECTED`: Transacción rechazada (valor > 1000)

### Flujo de Validación

1. Consume evento `transaction-created` de Kafka
2. Extrae el monto de la transacción
3. Aplica reglas de validación
4. Publica resultado al topic `transaction-status`
5. Transaction Service actualiza el estado

### Actuator (Monitoreo)

- Health: `http://localhost:8081/actuator/health`
- Metrics: `http://localhost:8081/actuator/metrics`

## 🔧 Configuración

### Variables de Entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `SPRING_PROFILES_ACTIVE` | - | Perfil activo (docker, antifraud) |
| `SPRING_KAFKA_BOOTSTRAP_SERVERS` | localhost:9092 | Servidores de Kafka |
| `SERVER_PORT` | 8081 | Puerto del servicio |

### Configuración de Kafka

```yaml
spring:
  kafka:
    consumer:
      group-id: antifraud-service-group
      auto-offset-reset: earliest
    producer:
      key-serializer: StringSerializer
      value-serializer: JsonSerializer
```

## 🏗️ Arquitectura

### Estructura de Paquetes

```
com.yape.challenge.antifraud/
├── AntiFraudApplication.java
├── service/              # Lógica de validación
│   └── AntiFraudService
├── kafka/                # Consumers y Producers
│   ├── TransactionEventConsumer
│   └── TransactionStatusProducer
└── config/               # Configuraciones
    └── KafkaConfig
```

### Componentes Principales

- **AntiFraudService**: Lógica de validación de transacciones
- **TransactionEventConsumer**: Consumidor de eventos de Kafka
- **TransactionStatusProducer**: Productor de resultados a Kafka

## 📊 Topics de Kafka

| Tipo | Topic | Descripción |
|------|-------|-------------|
| **Consume** | `transaction-created` | Transacciones nuevas del Transaction Service |
| **Produce** | `transaction-status` | Resultado de validación (APPROVED/REJECTED) |

### Ejemplo de Evento Consumido

```json
{
  "transactionExternalId": "550e8400-e29b-41d4-a716-446655440000",
  "accountExternalIdDebit": "Guid1",
  "accountExternalIdCredit": "Guid2",
  "tranferTypeId": 1,
  "value": 1500.00,
  "createdAt": "2026-01-04T10:30:00Z"
}
```

### Ejemplo de Evento Producido

```json
{
  "transactionExternalId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "REJECTED"
}
```

## 🧪 Testing

```bash
# Ejecutar tests
mvn test

# Ejecutar tests con cobertura
mvn test jacoco:report
```

### Escenarios de Test

- ✅ Validación de transacción válida (valor ≤ 1000)
- ✅ Rechazo de transacción fraudulenta (valor > 1000)
- ✅ Consumo correcto de eventos de Kafka
- ✅ Publicación correcta de resultados

## 🔍 Debugging

### Ver logs en Docker

```bash
docker-compose logs -f antifraud-service
```

### Monitorear Kafka UI

Accede a http://localhost:8090 para:
- Ver mensajes en topics
- Monitorear consumers
- Ver estado de procesamiento

## ⚙️ Reglas de Negocio

### Límites de Transacción

| Monto | Estado | Descripción |
|-------|--------|-------------|
| ≤ 1000 | ✅ APPROVED | Transacción válida |
| > 1000 | ❌ REJECTED | Posible fraude detectado |

### Extensibilidad

El servicio está diseñado para agregar fácilmente nuevas reglas:

```java
@Service
public class AntiFraudService {
    
    private static final BigDecimal FRAUD_THRESHOLD = new BigDecimal("1000");
    
    private TransactionStatus determineStatus(BigDecimal value) {
        // Regla 1: Validar monto máximo
        if (value.compareTo(FRAUD_THRESHOLD) > 0) {
            return TransactionStatus.REJECTED;
        }
        
        // Agregar más reglas aquí:
        // - Validar frecuencia de transacciones
        // - Validar patrones sospechosos
        // - Validar horarios inusuales
        // - etc.
        
        return TransactionStatus.APPROVED;
    }
}
```

## 📈 Performance

- **Throughput**: 100-500 eventos/seg
- **Latencia promedio**: 50-100ms por evento
- **Consumer group**: antifraud-service-group

## 🔗 Referencias

- [README Principal](../README.md)
- [Transaction Service](../transaction-service/README.md)

## 📝 Notas

- El servicio no tiene base de datos propia (stateless)
- Toda la comunicación es asíncrona vía Kafka
- Se puede escalar horizontalmente agregando más instancias
- Cada instancia procesará diferentes particiones del topic


