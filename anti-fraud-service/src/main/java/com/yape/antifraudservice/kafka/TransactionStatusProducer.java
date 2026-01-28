package com.yape.antifraudservice.kafka;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yape.antifraudservice.config.KafkaConfig;
import com.yape.antifraudservice.dto.TransactionStatusUpdateEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TransactionStatusProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    public void sendStatusUpdate(TransactionStatusUpdateEvent event) {
        try {
            String message = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(KafkaConfig.TRANSACTION_STATUS_TOPIC, event.getTransactionId().toString(), message);
            log.info("Sent status update for transaction: {} with status: {}",
                    event.getTransactionId(), event.getStatus());
        } catch (JsonProcessingException e) {
            log.error("Error serializing status update event", e);
            throw new RuntimeException("Error serializing event", e);
        }
    }
}
