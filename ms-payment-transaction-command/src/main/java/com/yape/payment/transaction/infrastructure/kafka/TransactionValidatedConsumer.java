package com.yape.payment.transaction.infrastructure.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yape.payment.transaction.application.TransactionService;
import com.yape.payment.transaction.infrastructure.kafka.dto.TransactionValidatedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class TransactionValidatedConsumer {

    private static final Logger logger = LoggerFactory.getLogger(TransactionValidatedConsumer.class);

    private final ObjectMapper objectMapper;
    private final TransactionService transactionService;

    public TransactionValidatedConsumer(ObjectMapper objectMapper, TransactionService transactionService) {
        this.objectMapper = objectMapper;
        this.transactionService = transactionService;
    }

    @KafkaListener(
            topics = KafkaTopics.PAYMENT_TRANSACTION_VALIDATED_V1,
            groupId = "${spring.kafka.consumer.group-id}"
    )
    public void consume(String message) {
        try {
            TransactionValidatedEvent event =
                    objectMapper.readValue(message, TransactionValidatedEvent.class);

            logger.info("Consumed validation event. transactionExternalId={}, result={}",
                    event.getTransactionExternalId(), event.getResult());

            transactionService.applyValidationResult(event);

        } catch (Exception e) {
            // log + rethrow para que Kafka reintente (si no tienes DLQ configurado)
            logger.error("Failed to process validation event message={}", message, e);
            throw new IllegalStateException("Failed to process validation event", e);
        }
    }
}
