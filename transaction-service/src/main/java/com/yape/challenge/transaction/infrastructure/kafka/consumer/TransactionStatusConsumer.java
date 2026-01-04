package com.yape.challenge.transaction.infrastructure.kafka.consumer;

import com.yape.challenge.common.dto.TransactionStatusEvent;
import com.yape.challenge.transaction.application.bus.CommandBus;
import com.yape.challenge.transaction.application.command.UpdateTransactionStatusCommand;
import com.yape.challenge.common.kafka.KafkaTopics;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionStatusConsumer {

    private final CommandBus commandBus;

    @KafkaListener(topics = KafkaTopics.TRANSACTION_STATUS_UPDATED, groupId = "${spring.kafka.consumer.group-id}")
    @CircuitBreaker(name = "database", fallbackMethod = "consumeTransactionStatusFallback")
    @Retry(name = "kafkaProducer")
    public void consumeTransactionStatus(TransactionStatusEvent event) {
        log.info("Received transaction status event: {}", event);

        try {
            // Create command to update transaction status
            UpdateTransactionStatusCommand command = UpdateTransactionStatusCommand.builder()
                    .externalId(event.getTransactionExternalId())
                    .status(event.getStatus())
                    .build();

            // Dispatch command through command bus
            commandBus.dispatch(command);

            log.info("Transaction status updated successfully for externalId: {}",
                    event.getTransactionExternalId());
        } catch (Exception e) {
            log.error("Error updating transaction status for externalId: {}",
                    event.getTransactionExternalId(), e);
            throw e;
        }
    }

    /**
     * Fallback method when Circuit Breaker is open for database operations
     */
    private void consumeTransactionStatusFallback(TransactionStatusEvent event, Exception ex) {
        log.error("Circuit Breaker OPEN or all retries failed for transaction status update. " +
                "TransactionExternalId: {}, Status: {}. Reason: {}",
                event.getTransactionExternalId(), event.getStatus(), ex.getMessage());

        // TODO: Implement fallback strategy:
        // 1. Save to dead letter topic
        // 2. Store in a retry queue
        // 3. Send alert for manual intervention

        // Don't throw exception to avoid message reprocessing loop
        log.warn("Message will be acknowledged to avoid reprocessing loop");
    }
}
