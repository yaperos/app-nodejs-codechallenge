package com.yape.antifraud.infrastructure.kafka.consumer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yape.antifraud.domain.model.EvaluatedTransaction;
import com.yape.antifraud.domain.port.in.EvaluateTransactionUseCase;
import com.yape.antifraud.domain.port.out.EvaluatedTransactionRepository;
import com.yape.antifraud.domain.port.out.TransactionStatusPublisher;
import com.yape.antifraud.infrastructure.kafka.dto.TransactionCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Kafka consumer that listens for transaction creation events.
 * Orchestrates the anti-fraud evaluation flow with manual offset acknowledgment.
 *
 * Flow:
 * 1. Deserialize the incoming event
 * 2. Check idempotency (skip if already processed)
 * 3. Delegate evaluation to the use case
 * 4. Persist the evaluation result
 * 5. Publish the status update
 * 6. Acknowledge the message (commit offset)
 *
 * No business logic resides here - this is purely orchestration.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionCreatedConsumer {

    private final EvaluateTransactionUseCase evaluateTransactionUseCase;
    private final EvaluatedTransactionRepository evaluatedTransactionRepository;
    private final TransactionStatusPublisher transactionStatusPublisher;
    private final ObjectMapper objectMapper;

    @KafkaListener(
            topics = "transaction.created",
            groupId = "antifraud-group"
    )
    public void consume(ConsumerRecord<String, String> record, Acknowledgment acknowledgment) {
        log.info("Received transaction event from topic={}, partition={}, offset={}",
                record.topic(), record.partition(), record.offset());

        try {
            // 1. Deserialize the event
            TransactionCreatedEvent event = objectMapper.readValue(record.value(), TransactionCreatedEvent.class);
            UUID transactionId = UUID.fromString(event.getTransactionId());

            log.info("Processing transaction: id={}, value={}", transactionId, event.getValue());

            // 2. Idempotency check: skip if already processed
            if (evaluatedTransactionRepository.existsByTransactionId(transactionId)) {
                log.warn("Transaction {} already evaluated, skipping (idempotent)", transactionId);
                acknowledgment.acknowledge();
                return;
            }

            // 3. Delegate evaluation to the use case (pure business logic)
            String status = evaluateTransactionUseCase.evaluate(transactionId, event.getValue());

            // 4. Save the evaluation result to the database
            EvaluatedTransaction evaluatedTransaction = EvaluatedTransaction.builder()
                    .transactionId(transactionId)
                    .status(status)
                    .evaluatedAt(LocalDateTime.now())
                    .build();
            evaluatedTransactionRepository.save(evaluatedTransaction);

            // 5. Publish the status update to Kafka
            transactionStatusPublisher.publishStatusUpdate(transactionId, status);

            // 6. Acknowledge the message (commit offset) only after successful processing
            acknowledgment.acknowledge();
            log.info("Successfully processed transaction {}: status={}", transactionId, status);

        } catch (JsonProcessingException e) {
            log.error("Failed to deserialize transaction event: {}", e.getMessage(), e);
            // Acknowledge to avoid reprocessing a permanently malformed message
            acknowledgment.acknowledge();
        } catch (IllegalArgumentException e) {
            log.error("Invalid transaction ID format in event: {}", e.getMessage(), e);
            // Acknowledge to avoid reprocessing a permanently invalid message
            acknowledgment.acknowledge();
        } catch (Exception e) {
            log.error("Unexpected error processing transaction event: {}", e.getMessage(), e);
            // Do NOT acknowledge - the message will be redelivered for retry
            throw e;
        }
    }
}
