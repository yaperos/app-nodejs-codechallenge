package com.yape.antifraudservice.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yape.antifraudservice.config.KafkaConfig;
import com.yape.antifraudservice.dto.TransactionCreatedEvent;
import com.yape.antifraudservice.dto.TransactionStatusUpdateEvent;
import com.yape.antifraudservice.service.FraudValidationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionCreatedConsumer {

    private final FraudValidationService fraudValidationService;
    private final TransactionStatusProducer transactionStatusProducer;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = KafkaConfig.TRANSACTION_CREATED_TOPIC, groupId = "anti-fraud-service")
    public void consumeTransactionCreated(String message) {
        try {
            TransactionCreatedEvent event = objectMapper.readValue(message, TransactionCreatedEvent.class);
            log.info("Received transaction created event for transaction: {}", event.getTransactionId());

            boolean isValid = fraudValidationService.isTransactionValid(event.getValue());
            String status = isValid ? "APPROVED" : "REJECTED";

            TransactionStatusUpdateEvent statusEvent = TransactionStatusUpdateEvent.builder()
                    .transactionId(event.getTransactionId())
                    .status(status)
                    .build();

            transactionStatusProducer.sendStatusUpdate(statusEvent);
        } catch (JsonProcessingException e) {
            log.error("Error deserializing transaction created event", e);
        }
    }
}
