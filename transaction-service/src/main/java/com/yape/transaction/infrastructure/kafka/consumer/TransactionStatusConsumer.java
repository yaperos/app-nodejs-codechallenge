package com.yape.transaction.infrastructure.kafka.consumer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yape.transaction.domain.model.Transaction;
import com.yape.transaction.domain.model.TransactionStatus;
import com.yape.transaction.domain.port.out.TransactionCachePort;
import com.yape.transaction.domain.port.out.TransactionRepository;
import com.yape.transaction.infrastructure.kafka.dto.TransactionStatusUpdatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionStatusConsumer {

    private final TransactionRepository transactionRepository;
    private final TransactionCachePort transactionCachePort;
    private final ObjectMapper objectMapper;

    @KafkaListener(
            topics = "transaction.status.updated",
            groupId = "transaction-group"
    )
    public void consume(@Payload String message, Acknowledgment acknowledgment) {
        log.info("Received transaction status update event: {}", message);

        try {
            TransactionStatusUpdatedEvent event = objectMapper.readValue(message, TransactionStatusUpdatedEvent.class);

            TransactionStatus newStatus = TransactionStatus.valueOf(event.getStatus());
            Transaction updatedTransaction = transactionRepository.updateStatus(event.getTransactionId(), newStatus);

            transactionCachePort.evict(event.getTransactionId());
            transactionCachePort.put(updatedTransaction);

            log.info("Transaction status updated to {} for transactionId: {}",
                    newStatus, event.getTransactionId());

            acknowledgment.acknowledge();

        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize transaction status update event: {}", message, e);
            acknowledgment.acknowledge();
        } catch (IllegalArgumentException e) {
            log.error("Invalid transaction status in event: {}", message, e);
            acknowledgment.acknowledge();
        } catch (Exception e) {
            log.error("Error processing transaction status update event: {}", message, e);
            throw e;
        }
    }
}
