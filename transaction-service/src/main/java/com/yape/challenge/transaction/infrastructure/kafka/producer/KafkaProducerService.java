package com.yape.challenge.transaction.infrastructure.kafka.producer;

import com.yape.challenge.common.dto.TransactionCreatedEvent;
import com.yape.challenge.transaction.infrastructure.kafka.exception.KafkaProducerException;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

/**
 * Service for sending messages to Kafka with Circuit Breaker pattern
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaProducerService {

    private final KafkaTemplate<String, TransactionCreatedEvent> kafkaTemplate;

    /**
     * Send transaction created event to Kafka with Circuit Breaker and Retry
     *
     * @param topic Topic name
     * @param key Message key
     * @param event Event to send
     */
    @CircuitBreaker(name = "kafkaProducer", fallbackMethod = "sendEventFallback")
    @Retry(name = "kafkaProducer")
    public void sendTransactionCreatedEvent(String topic, String key, TransactionCreatedEvent event) {
        log.info("Sending event to Kafka topic '{}' with key '{}': {}", topic, key, event);

        try {
            CompletableFuture<SendResult<String, TransactionCreatedEvent>> future =
                kafkaTemplate.send(topic, key, event);

            // Wait for the result with timeout to ensure Circuit Breaker catches exceptions
            // Timeout of 5 seconds to fail fast if Kafka is unavailable
            SendResult<String, TransactionCreatedEvent> result = future.get(5, TimeUnit.SECONDS);

            if (result != null && result.getRecordMetadata() != null) {
                log.info("Event sent successfully to topic '{}', partition: {}, offset: {}",
                    topic,
                    result.getRecordMetadata().partition(),
                    result.getRecordMetadata().offset());
            } else {
                log.info("Event sent successfully to topic '{}', but no record metadata was returned", topic);
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt(); // Restore interrupt status
            log.error("Thread interrupted while sending event to Kafka topic '{}': {}", topic, e.getMessage());
            throw new KafkaProducerException("Thread interrupted while sending event to Kafka", e);
        } catch (Exception e) {
            log.error("Failed to send event to Kafka topic '{}': {}", topic, e.getMessage());
            throw new KafkaProducerException("Error sending event to Kafka", e);
        }
    }

    /**
     * Fallback method when Circuit Breaker is open or all retries fail
     * This method logs the error and prevents cascading failures.
     * In production, this could:
     * - Save to a dead letter queue
     * - Save to database for later retry
     * - Send notification to monitoring system
     */
    @SuppressWarnings("unused") // Used by Circuit Breaker via reflection
    private void sendEventFallback(String topic, String key, TransactionCreatedEvent event, Exception ex) {
        log.error("Circuit Breaker OPEN or all retries failed for Kafka producer. " +
                "Topic: {}, Key: {}, Event: {}. Reason: {}",
                topic, key, event, ex.getMessage());

        // Strategy: Log and allow the application to continue
        // The transaction is already created in the database (Event Sourcing)
        // The antifraud service will not receive the notification immediately,
        // but the system remains available for other operations

        log.warn("Transaction {} created but notification to antifraud service failed. " +
                "Manual intervention or retry mechanism may be required.", event.getTransactionExternalId());

        throw new KafkaProducerException("Kafka service is temporarily unavailable. Transaction created but notification failed.", ex);
    }
}

