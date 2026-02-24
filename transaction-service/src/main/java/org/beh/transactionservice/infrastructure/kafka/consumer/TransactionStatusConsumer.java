package org.beh.transactionservice.infrastructure.kafka.consumer;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.beh.transactionservice.application.command.UpdateTransactionStatusCommand;
import org.beh.transactionservice.application.service.TransactionService;
import org.beh.transactionservice.domain.model.TransactionStatus;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionStatusConsumer {

    private final TransactionService transactionService;
    private final ObjectMapper objectMapper;

    @KafkaListener(
        topics = "transaction.status.updated",
        groupId = "transaction-service-group",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void consume(
            @Payload String message,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset,
            Acknowledgment ack) {

        log.debug("Received status update from partition [{}] offset [{}]", partition, offset);

        try {
            JsonNode payload = objectMapper.readTree(message);
            UUID transactionId = UUID.fromString(payload.get("transactionId").asText());
            TransactionStatus status = TransactionStatus.valueOf(payload.get("status").asText().toUpperCase());

            UpdateTransactionStatusCommand command = new UpdateTransactionStatusCommand();
            command.setTransactionId(transactionId);
            command.setStatus(status);

            transactionService.updateTransactionStatus(command);

            // Only ack after successful processing — guarantees at-least-once processing
            ack.acknowledge();
            log.info("Transaction [{}] status updated to [{}]", transactionId, status);

        } catch (Exception e) {
            /**
             * Do NOT ack — Kafka will redeliver.
             * In production, wire a DeadLetterPublishingRecoverer so messages
             * that fail repeatedly go to a DLT (Dead Letter Topic) instead of
             * blocking the partition forever.
             */
            log.error("Failed to process status update from partition [{}] offset [{}]: {}",
                partition, offset, e.getMessage(), e);
        }
    }
}
