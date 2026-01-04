# Common Module

Módulo compartido que contiene clases y utilidades comunes utilizadas por todos los microservicios del proyecto Yape Challenge.

## 📦 Contenido

Este módulo incluye:

- **DTOs**: Data Transfer Objects compartidos entre servicios
- **Kafka Topics**: Constantes con nombres de topics de Kafka
- **Enums**: Enumeraciones comunes (estados de transacción)

## 🏗️ Estructura

```
common/
├── pom.xml
└── src/
    └── main/
        └── java/
            └── com/yape/challenge/common/
                ├── dto/
                │   ├── TransactionCreatedEvent.java
                │   ├── TransactionStatusEvent.java
                │   └── TransactionStatus.java
                └── kafka/
                    └── KafkaTopics.java
```

## 📄 Clases Principales

### DTOs

#### TransactionCreatedEvent
Evento publicado cuando se crea una nueva transacción.

**Campos:**
- `transactionExternalId` (UUID): ID externo de la transacción
- `accountExternalIdDebit` (String): ID de cuenta de débito
- `accountExternalIdCredit` (String): ID de cuenta de crédito
- `tranferTypeId` (Integer): ID del tipo de transferencia
- `value` (BigDecimal): Monto de la transacción
- `createdAt` (LocalDateTime): Fecha y hora de creación

**Topic Kafka:** `transaction-created`

#### TransactionStatusEvent
Evento publicado cuando se actualiza el estado de una transacción.

**Campos:**
- `transactionExternalId` (UUID): ID externo de la transacción
- `status` (TransactionStatus): Nuevo estado de la transacción

**Topic Kafka:** `transaction-status`

#### TransactionStatus (Enum)
Estados posibles de una transacción:

- `PENDING`: Transacción creada, pendiente de validación
- `APPROVED`: Transacción aprobada por anti-fraude
- `REJECTED`: Transacción rechazada por anti-fraude

### Kafka Topics

#### KafkaTopics
Constantes con los nombres de los topics de Kafka:

```java
public class KafkaTopics {
    public static final String TRANSACTION_CREATED = "transaction-created";
    public static final String TRANSACTION_STATUS_UPDATED = "transaction-status";
}
```

## 🔧 Uso

### Como Dependencia Maven

En los módulos `transaction-service` y `antifraud-service`, este módulo se incluye como dependencia:

```xml
<dependency>
    <groupId>com.yape</groupId>
    <artifactId>common</artifactId>
    <version>0.0.1-SNAPSHOT</version>
</dependency>
```

### Ejemplo de Uso

#### En Transaction Service (Productor)

```java
import com.yape.challenge.common.dto.TransactionCreatedEvent;
import com.yape.challenge.common.kafka.KafkaTopics;

@Service
public class TransactionProducer {
    
    private final KafkaTemplate<String, TransactionCreatedEvent> kafkaTemplate;
    
    public void publishTransactionCreated(TransactionCreatedEvent event) {
        kafkaTemplate.send(
            KafkaTopics.TRANSACTION_CREATED,
            event.getTransactionExternalId().toString(),
            event
        );
    }
}
```

#### En Anti-Fraud Service (Consumidor)

```java
import com.yape.challenge.common.dto.TransactionCreatedEvent;
import com.yape.challenge.common.dto.TransactionStatusEvent;
import com.yape.challenge.common.dto.TransactionStatus;
import com.yape.challenge.common.kafka.KafkaTopics;

@Service
public class AntiFraudService {
    
    @KafkaListener(topics = KafkaTopics.TRANSACTION_CREATED)
    public void handleTransactionCreated(TransactionCreatedEvent event) {
        // Validar transacción
        TransactionStatus status = validate(event);
        
        // Publicar resultado
        TransactionStatusEvent statusEvent = TransactionStatusEvent.builder()
            .transactionExternalId(event.getTransactionExternalId())
            .status(status)
            .build();
            
        kafkaTemplate.send(KafkaTopics.TRANSACTION_STATUS_UPDATED, statusEvent);
    }
}
```

## 📋 Compilación

Este módulo se compila automáticamente como parte del proyecto principal:

```bash
# Desde la raíz del proyecto
mvn clean install

# Solo el módulo common
mvn clean install -pl common
```

## 🧪 Testing

```bash
# Ejecutar tests del módulo
mvn test -pl common
```

## 📝 Notas

- Este módulo **NO** tiene dependencias de Spring Boot
- Es una librería Java pura con POJOs
- Se usa tanto en `transaction-service` como en `antifraud-service`
- No genera un JAR ejecutable, solo una librería
- Todos los DTOs usan Lombok para reducir boilerplate

## 🔗 Referencias

- [README Principal](../README.md)
- [Transaction Service](../transaction-service/README.md)
- [Anti-Fraud Service](../antifraud-service/README.md)

## 📊 Diagrama de Dependencias

```
┌─────────────────────┐
│   transaction-      │
│     service         │
└──────────┬──────────┘
           │
           │  depends on
           │
           ▼
┌─────────────────────┐
│      common         │◄──────────┐
│   (shared lib)      │           │
└─────────────────────┘           │
                                  │
                         depends on
                                  │
           ┌──────────────────────┘
           │
┌──────────▼──────────┐
│   antifraud-        │
│     service         │
└─────────────────────┘
```

## 🎯 Propósito

Este módulo existe para:

1. **Evitar duplicación de código**: DTOs usados por múltiples servicios
2. **Mantener contratos consistentes**: Mismos DTOs para Kafka
3. **Facilitar el mantenimiento**: Cambios en un solo lugar
4. **Type safety**: Usar enums en lugar de strings para estados
5. **Documentación centralizada**: Constantes de topics en un lugar

