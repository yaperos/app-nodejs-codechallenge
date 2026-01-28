package com.yape.transactionservice.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yape.transactionservice.config.KafkaConfig;
import com.yape.transactionservice.dto.TransactionCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void sendTransactionCreatedEvent(TransactionCreatedEvent event) {
        try {
            String message = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(KafkaConfig.TRANSACTION_CREATED_TOPIC, event.getTransactionId().toString(), message);
            log.info("Sent transaction created event for transaction: {}", event.getTransactionId());
        } catch (JsonProcessingException e) {
            log.error("Error serializing transaction created event", e);
            throw new RuntimeException("Error serializing event", e);
        }
    }
}
