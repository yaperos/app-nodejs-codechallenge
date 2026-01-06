package pe.com.yape.ms.transaction.application.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import pe.com.yape.ms.transaction.application.dto.TransactionValidatedEventDto;
import pe.com.yape.ms.transaction.model.domain.Transaction;
import pe.com.yape.ms.transaction.model.domain.TransactionStatus;
import pe.com.yape.ms.transaction.service.port.CacheRepositoryPort;
import pe.com.yape.ms.transaction.service.port.TransactionRepositoryPort;

/**
 * Consumer que escucha eventos de validación de transacciones desde Antifraud
 * usando @KafkaListener
 * @author lmarusic
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionValidationConsumer {

    private final TransactionRepositoryPort transactionRepository;
    private final CacheRepositoryPort cacheRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    private static final long CACHE_TTL_SECONDS = 3600L;

    @KafkaListener(
        topics = "transaction.validated",
        groupId = "transaction-service-consumer-group",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void consumeValidation(String payload) {
        String transactionId = "unknown";
        try {
            log.debug("Raw payload received: {}", payload);
            
            TransactionValidatedEventDto event = objectMapper.readValue(
                payload,
                TransactionValidatedEventDto.class
            );
            
            transactionId = event.transactionExternalId();
            log.info("Received validation event for transaction: {} with status: {}",
                transactionId, event.validationStatus());

            UUID transactionUUID = UUID.fromString(transactionId);
            final String txId = transactionId; 
            Transaction currentTransaction = transactionRepository
                .findByExternalId(transactionUUID)
                .orElseThrow(() -> {
                    log.warn("Transaction not found for validation: {}", txId);
                    return new RuntimeException("Transaction not found: " + txId);
                });

            if (!currentTransaction.isPending()) {
                log.warn("Transaction {} is not in PENDING state, current status: {}. Skipping update.",
                    transactionId, currentTransaction.status());
                return;
            }

            TransactionStatus newStatus = mapValidationStatus(event.validationStatus());

            //  Actualizar el estado de la transacción en PostgreSQL
            Transaction updatedTransaction = currentTransaction.withStatus(newStatus);
            Transaction savedTransaction = transactionRepository.update(updatedTransaction);

            //  Guardar en Redis
            cacheRepository.save(savedTransaction, CACHE_TTL_SECONDS);

            log.info("Transaction {} successfully updated to status: {} - Reason: {}",
                transactionId, newStatus, event.validationReason());

        } catch (Exception e) {
            log.error("Error processing validation event for transaction {}: {}",
                transactionId, e.getMessage(), e);
            log.error("Stack trace: ", e);
        }
    }

    private TransactionStatus mapValidationStatus(String validationStatus) {
        if (validationStatus == null) {
            throw new IllegalArgumentException("Validation status cannot be null");
        }
        
        return switch (validationStatus.toUpperCase()) {
            case "APPROVED" -> TransactionStatus.APPROVED;
            case "REJECTED" -> TransactionStatus.REJECTED;
            default -> throw new IllegalArgumentException(
                "Unknown validation status: " + validationStatus
            );
        };
    }
}
