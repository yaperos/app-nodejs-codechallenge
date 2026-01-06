package com.yape.antifraud.infrastructure.messaging.consumer;

import com.yape.antifraud.domain.service.FraudValidatorService;
import com.yape.antifraud.infrastructure.messaging.event.TransactionCreatedEvent;
import com.yape.antifraud.infrastructure.messaging.event.TransactionStatusUpdatedEvent;
import com.yape.antifraud.infrastructure.messaging.producer.FraudResultProducer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Consumer de Kafka para eventos de transacciones creadas
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionCreatedConsumer {

    private final FraudValidatorService fraudValidatorService;
    private final FraudResultProducer fraudResultProducer;

    @KafkaListener(
            topics = "${kafka.topics.transaction-created}",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consume(TransactionCreatedEvent event, Acknowledgment acknowledgment) {
        try {
            log.info("Received TransactionCreatedEvent: {}", event);

            // Validar transacción
            FraudValidatorService.ValidationResult result = fraudValidatorService.validate(
                    event.getTransactionExternalId(),
                    event.getValue()
            );

            // Publicar resultado
            TransactionStatusUpdatedEvent statusEvent = TransactionStatusUpdatedEvent.builder()
                    .eventId(UUID.randomUUID().toString())
                    .eventType("TRANSACTION_STATUS_UPDATED")
                    .timestamp(java.time.Instant.now().toString())
                    .correlationId(event.getTransactionExternalId())
                    .transactionExternalId(event.getTransactionExternalId())
                    .newStatus(result.getStatus())
                    .reason(result.getReason())
                    .build();

            fraudResultProducer.publishValidationResult(statusEvent);

            // Confirmar mensaje procesado
            acknowledgment.acknowledge();
            log.info("TransactionCreatedEvent processed successfully");

        } catch (Exception e) {
            log.error("Error processing TransactionCreatedEvent: {}", event, e);
            acknowledgment.acknowledge(); // Confirmar para evitar loops infinitos
        }
    }
}

