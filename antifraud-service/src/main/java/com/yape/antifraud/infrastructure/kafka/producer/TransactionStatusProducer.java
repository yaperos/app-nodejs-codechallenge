package com.yape.antifraud.infrastructure.kafka.producer;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yape.antifraud.domain.port.out.TransactionStatusPublisher;
import com.yape.antifraud.infrastructure.kafka.dto.TransactionStatusUpdatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Kafka producer that implements the TransactionStatusPublisher domain port.
 * Publishes transaction status updates to the "transaction.status.updated" topic.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionStatusProducer implements TransactionStatusPublisher {

    private static final String TOPIC = "transaction.status.updated";

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public void publishStatusUpdate(UUID transactionId, String status) {
        TransactionStatusUpdatedEvent event = TransactionStatusUpdatedEvent.builder()
                .transactionId(transactionId.toString())
                .status(status)
                .build();

        try {
            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(TOPIC, transactionId.toString(), payload)
                    .whenComplete((result, ex) -> {
                        if (ex != null) {
                            log.error("Failed to publish status update for transaction {}: {}",
                                    transactionId, ex.getMessage(), ex);
                        } else {
                            log.info("Published status update for transaction {} to topic {}: status={}",
                                    transactionId, TOPIC, status);
                        }
                    });
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize status update event for transaction {}: {}",
                    transactionId, e.getMessage(), e);
            throw new RuntimeException("Failed to serialize transaction status event", e);
        }
    }
}
