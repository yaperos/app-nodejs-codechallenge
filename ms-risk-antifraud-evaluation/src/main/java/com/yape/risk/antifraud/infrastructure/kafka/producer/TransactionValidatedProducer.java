package com.yape.risk.antifraud.infrastructure.kafka.producer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yape.risk.antifraud.infrastructure.kafka.KafkaTopics;
import com.yape.risk.antifraud.infrastructure.kafka.dto.TransactionValidatedEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class TransactionValidatedProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public TransactionValidatedProducer(KafkaTemplate<String, String> kafkaTemplate,
                                        ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void publish(TransactionValidatedEvent event) {
        try {
            String payload = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(
                    KafkaTopics.PAYMENT_TRANSACTION_VALIDATED_V1,
                    event.getTransactionExternalId().toString(),
                    payload
            );
        } catch (Exception e) {
            throw new IllegalStateException("Error publishing antifraud result", e);
        }
    }
}
