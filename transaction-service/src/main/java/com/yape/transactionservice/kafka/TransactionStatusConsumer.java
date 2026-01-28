package com.yape.transactionservice.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yape.transactionservice.config.KafkaConfig;
import com.yape.transactionservice.dto.TransactionStatusUpdateEvent;
import com.yape.transactionservice.entity.TransactionStatus;
import com.yape.transactionservice.service.TransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionStatusConsumer {

    private final TransactionService transactionService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = KafkaConfig.TRANSACTION_STATUS_TOPIC, groupId = "transaction-service")
    public void consumeTransactionStatus(String message) {
        try {
            TransactionStatusUpdateEvent event = objectMapper.readValue(message, TransactionStatusUpdateEvent.class);
            log.info("Received status update for transaction: {} with status: {}",
                    event.getTransactionId(), event.getStatus());

            TransactionStatus status = TransactionStatus.valueOf(event.getStatus().toUpperCase());
            transactionService.updateTransactionStatus(event.getTransactionId(), status);
        } catch (JsonProcessingException e) {
            log.error("Error deserializing transaction status event", e);
        }
    }
}
