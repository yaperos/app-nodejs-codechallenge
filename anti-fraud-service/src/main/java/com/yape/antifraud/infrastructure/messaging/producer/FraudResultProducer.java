package com.yape.antifraud.infrastructure.messaging.producer;

import com.yape.antifraud.infrastructure.messaging.event.TransactionStatusUpdatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

/**
 * Producer de Kafka para publicar resultados de validación
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class FraudResultProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${kafka.topics.transaction-status-updated}")
    private String transactionStatusUpdatedTopic;

    public void publishValidationResult(TransactionStatusUpdatedEvent event) {
        log.info("Publishing validation result for transaction: {}", event.getTransactionExternalId());

        CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(
                transactionStatusUpdatedTopic,
                event.getTransactionExternalId().toString(),
                event
        );

        future.whenComplete((result, ex) -> {
            if (ex == null) {
                log.info("Validation result published successfully for transaction: {} with status: {}",
                        event.getTransactionExternalId(), event.getNewStatus());
            } else {
                log.error("Failed to publish validation result for transaction: {}",
                        event.getTransactionExternalId(), ex);
            }
        });
    }
}

