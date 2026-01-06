package com.yape.transaction.infrastructure.messaging.consumer;

import com.yape.transaction.application.service.TransactionService;
import com.yape.transaction.infrastructure.messaging.event.TransactionStatusUpdatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

/**
 * Consumer de Kafka para eventos de actualización de estado
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionStatusConsumer {

    private final TransactionService transactionService;

    @KafkaListener(
            topics = "${kafka.topics.transaction-status-updated}",
            groupId = "${spring.kafka.consumer.group-id}",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void consume(TransactionStatusUpdatedEvent event, Acknowledgment acknowledgment) {
        try {
            log.info("Received TransactionStatusUpdatedEvent: {}", event);

            // Actualizar estado de la transacción
            transactionService.updateTransactionStatus(
                    event.getTransactionExternalId(),
                    event.getNewStatus()
            );

            // Confirmar mensaje procesado
            acknowledgment.acknowledge();
            log.info("TransactionStatusUpdatedEvent processed successfully");

        } catch (Exception e) {
            log.error("Error processing TransactionStatusUpdatedEvent: {}", event, e);
            // En un escenario real, aquí implementarías retry logic o DLQ
            acknowledgment.acknowledge(); // Por ahora, confirmamos para evitar loops infinitos
        }
    }
}

